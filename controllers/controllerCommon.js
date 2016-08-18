var schema = require('../app/schema').Schema,
    models = require('../app/models'),
    Promise = require('bluebird'),
    moment = require('moment'),
    ShiftShared = require('../ionic/www/js/shared/ShiftShared'),
    slack = require('../app/slack'),
    _ = require('underscore');

var Bookshelf = models.Bookshelf;
var getModelKeys = models.getModelKeys;

// TODO: Hook this up to a generalized logging utility
function audit(req, text) {
    var user = req.user.id;
    if (user) {
        user = " User: " + user;
    }

    console.log(req.path + ": " + req.ip + user + " -> " + text);
}

var defaultBannedKeys = ['id'];

module.exports = {
    error: error,
    clientError: clientError,
    clientCreate: clientCreate,
    clientStatus: clientStatus,
    getCurrentTimeForInsertionIntoDatabase: function() {
        return (new moment()).unix();
    },
    updateModel: updateModel,
    patchModel: function patchModel(modelName, queryArgs, req, res, updateMessage, defaultExcludes, sqlOptions, successCallback, updateSource) {
        if (defaultExcludes === undefined) {
            defaultExcludes = defaultBannedKeys;
        } else if (!defaultExcludes instanceof Array) {
            throw new Error("Excludes must be an array to have any effect: " + typeof defaultExcludes);
        }
        // TODO: Refactor all routes to use the same code paths for create/patch etc
        // TODO: Consolidate return messages into a function so everything is consistent
        // TODO: WARNING: UNSAFE: Submit pull request to bookshelf-validator to support {patch: true}
        var tableName = models.getTableNameFromModel(modelName);
        if (updateSource === undefined) {
            updateSource = req;
            if (req.hasOwnProperty('body')) {
                updateSource = req.body;
            }
        }
        models[modelName].query(function(q) {
            var query = q.select()
                .from(tableName);
            _.each(queryArgs, function(value, key) {
                query = query.where(tableName + "." + key, '=', value);
            });
            query.update(getPatchKeysWithoutBannedKeys(
                    modelName,
                    updateSource,
                    defaultExcludes
                )
            )
        })
            .fetch(sqlOptions)
            .then(function(model) {
                if (model) {
                    var result;
                    if (successCallback !== undefined) {
                        result = successCallback(model);
                    }
                    return Promise.resolve(result)
                        .then(function() {
                            respond(res, false, 'Success');
                        })
                        .catch(function(err) {
                            error(req, res, err);
                        })
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(function(err) {
                error(req, res, err);
            });
    },
    getSingleModel: function getSingleModel(modelName, queryArgs, sqlOptions, req, res) {
        models[modelName].forge(queryArgs)
            .fetch(sqlOptions)
            .then(function (fetchedResult) {
                if (fetchedResult) {
                    res.json(fetchedResult);
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(function (err) {
                error(req, res, err);
            });
    },
    simpleGetSingleModel: function simpleGetSingleModel(modelName, queryArgs, req, res) {
        models[modelName].forge(queryArgs)
            .fetch()
            .then(function (fetchedResult) {
                if (fetchedResult) {
                    res.json(fetchedResult);
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(function (err) {
                error(req, res, err);
            });
    },
    simpleGetListModel: function simpleGetListModel(modelName, queryArgs, req, res, options) {
        var query = models[modelName].forge();
        if (queryArgs) {
            query = query.query({where: queryArgs});
        }
        query.fetchAll(options)
            .then(function (fetchedResult) {
                res.json(fetchedResult);
            })
            .catch(function (err) {
                error(req, res, err);
            });
    },
    postModel: function postModel(modelName, otherArgs, req, res, bannedKeys, sqlOptions) {
        var modelKeys = getModelKeys(modelName, bannedKeys);
        var keysToSave = _.pick(req.body, _.keys(modelKeys));

        var fullArgs = _.extend(keysToSave, otherArgs);
        return models[modelName].forge(fullArgs)
            .save(undefined, sqlOptions)
            .then(function (saved) {
                clientCreate(req, res, 201, saved.get('id'));
            })
            .catch(function (err) {
                if (err.hasOwnProperty('errors')) {
                    // bookshelf-validator errors
                    clientError(req, res, 400, err.errors);
                } else {
                    error(req, res, err);
                }
            });
    },
    deleteModel: function deleteModel(modelName, queryArgs, req, res, successMessage, sqlOptions, successCallback) {
        models[modelName].forge()
            .where(queryArgs)
            .destroy(sqlOptions)
            .then(function () {
                return respond(res, false, successMessage, successCallback);
            })
            .catch(function (err) {
                error(req, res, err);
            });
    },
    grabNormalShiftRange: ShiftShared.grabNormalShiftRange,
    getPatchKeysWithoutBannedKeys: getPatchKeysWithoutBannedKeys,
    getMark: getMark,
    setMark: setMark,
    clearMarks: clearMarks,
    getModelKeys: getModelKeys,
    true: true,
    respond: respond,
    createSelectQueryForAllColumns: createSelectQueryForAllColumns
};

function respond(res, error, message, next) {
    res.json({error: error, data: {message: message}});
    if (next) {
        return next();
    }
}

/*
function getModelKeys(modelName, bannedKeys) {
    if (!bannedKeys) {
        bannedKeys = defaultBannedKeys;
    }
    if (!schema.hasOwnProperty(modelName)) {
        throw new Error("Model: " + modelName + " does not exist in Schema");
    }
    var modelKeys = schema[modelName];

    return _.omit(modelKeys, bannedKeys);
}
*/

function filterClientUpdateInput(modelName, updateData, bannedKeys) {
    if (!bannedKeys) {
        bannedKeys = defaultBannedKeys;
    }
    var modelKeys = schema[modelName];
    if (modelKeys === undefined) {
        throw new Error("Model: " + modelName + " does not exist in Schema");
    }

    return _.pick(_.omit(updateData, bannedKeys), _.keys(modelKeys));
}

function updateModel(modelName, bookshelfFetchedModelObject, updatedData, bannedKeys) {
    if (!bannedKeys) {
        bannedKeys = defaultBannedKeys;
    }
    if (!schema.hasOwnProperty(modelName)) {
        throw new Error("Model: " + modelName + " does not exist in Schema");
    }
    var modelKeys = schema[modelName];

    var updatedModelValues = {};
    _.each(modelKeys, function(value, key) {
        if (!bannedKeys.hasOwnProperty(key)) {
            updatedModelValues[key] = updatedData[key] || bookshelfFetchedModelObject.get(key);
        }
    });

    return updatedModelValues;
}

function getPatchKeysWithoutBannedKeys(modelName, patchableData, bannedKeys) {
    if (!bannedKeys) {
        bannedKeys = defaultBannedKeys;
    }
    if (!schema.hasOwnProperty(modelName)) {
        throw new Error("Model: " + modelName + " does not exist in Schema");
    }
    var modelKeys = schema[modelName];

    return _.pick(patchableData, _.without(_.keys(modelKeys), bannedKeys));
}

function setMark(req, mark, value, submark) {
    if (req.user.marks === undefined) {
        req.user.marks = {};
    }

    if (req.user.marks[mark] === undefined) {
        req.user.marks[mark] = {};
    }

    if (submark !== undefined) {
        if (req.user.marks[submark] === undefined) {
            req.user.marks[submark] = {};
        }

        if (typeof req.user.marks != 'object') {
            throw new Error("Cannot set mark value, unkown type: " + (typeof req.user.marks));
        }

        req.user.marks[mark][submark] = value;
    } else {
        req.user.marks[mark] = value;
    }
}

function getMark(req, mark, submark) {
    if (req.user.marks === undefined) {
        return undefined;
    }

    if (submark === undefined) {
        return req.user.marks[mark];
    } else {
        return req.user.marks[mark][submark];
    }
}

function clearMarks(req) {
    if (req.user.marks !== undefined) {
        delete req.user.marks;
    }
}

function createSelectQueryForAllColumns(modelName, tablename, bannedKeys) {
    if (!schema.hasOwnProperty(modelName)) {
        throw new Error("Unknown model name: " + modelName);
    }

    var columns = [];
    _.each(_.keys(schema[modelName]), function(columnName) {
        if (columnName != 'comment' && // comments are not actual column names
            ((bannedKeys === null || bannedKeys === undefined) ||
            ((bannedKeys !== null && bannedKeys !== undefined) &&
              bannedKeys.indexOf(columnName) == -1))) {
            columns.push(tablename + '.' + columnName + ' as ' + columnName);
        }
    });

    return columns;
}

function error(req, res, err, message) {
    slack.error(req, message, err);
    if (err.stack) {
        console.log(req.originalUrl + " => " + err + "\n" + err.stack);
    }
    if (res !== undefined && res !== null) {
        if (message === undefined) {
            message = err.message;
        }
        if (res.headersSent) {
            console.log("ERROR: CANNOT SEND CLIENT AN ERROR DUE TO HEADERS ALREADY BEING SENT");
            console.log(message);
        } else {
            res.status(500).json({error: true, data: {message: message}});
        }
    }
}

function clientError(req, res, status, message) {
    if (res.headersSent) {
        console.log("ERROR: CANNOT SEND CLIENT AN ERROR DUE TO HEADERS ALREADY BEING SENT");
        console.log(message);
    } else {
        res.status(status).json({error: true, data: {message: message}});
    }
}

function clientStatus(req, res, status) {
    clientCreate(req, res, status, null);
}

function clientCreate(req, res, status, id) {
    if (id == null) {
        res.sendStatus(status);
    } else if(id instanceof Array) {
        res.status(status).json(id);
    } else {
        res.status(status).json({id: id});
    }
}
