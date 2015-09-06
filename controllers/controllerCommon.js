var schema = require('../app/schema').Schema,
    models = require('../app/models'),
    moment = require('moment'),
    _ = require('underscore');

var Bookshelf = models.Bookshelf;

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
    error: function(req, res, err) {
        console.log(req.originalUrl + " => " + err + "\n" + err.stack);
        if (res !== undefined && res !== null) {
            res.status(500).json({error: true, data: {message: err}});
        }
    },
    getCurrentTimeForInsertionIntoDatabase: function() {
        return (new moment()).unix();
    },
    updateModel: updateModel,
    patchModel: function(modelName, queryArgs, req, res, updateMessage, defaultExcludes, sqlOptions, successCallback) {
        if (defaultExcludes === undefined) {
            defaultExcludes = defaultBannedKeys;
        }
        // TODO: Refactor all routes to use the same code paths for create/patch etc
        // TODO: Consolidate return messages into a function so everything is consistent
        // TODO: WARNING: UNSAFE: Submit pull request to bookshelf-validator to support {patch: true}
        var sqlOptionsWithTransaction = sqlOptions;
        models[modelName].forge(queryArgs)
            .fetch(sqlOptionsWithTransaction)
            .then(function (fetchedResult) {
                if (!fetchedResult) {
                    audit(req, "Couldn't find: " + modelName + ": " + JSON.stringify(queryArgs));
                    res.sendStatus(403);
                } else {
                    var updated = updateModel(modelName, fetchedResult, req.body, defaultExcludes);
                    fetchedResult.save(
                        updated,
                        sqlOptionsWithTransaction
                    )
                        .then(function (model) {
                            if (successCallback !== undefined) {
                                successCallback(model);
                            }
                            res.json({error: false, data: {message: updateMessage}});
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                }
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    simpleGetSingleModel: function(modelName, queryArgs, req, res) {
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
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    simpleGetListModel: function(modelName, queryArgs, req, res) {
        models[modelName].forge(queryArgs)
            .fetchAll()
            .then(function (fetchedResult) {
                res.json(fetchedResult);
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    postModel: function(modelName, otherArgs, req, res, bannedKeys, sqlOptions) {
        var modelKeys = getModelKeys(modelName, bannedKeys);
        var keysToSave = _.pick(req.body, _.keys(modelKeys));

        var fullArgs = _.extend(keysToSave, otherArgs);
        models[modelName].forge(fullArgs)
            .save(sqlOptions)
            .then(function (saved) {
                res.status(201).json({id: saved.get('id')});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    deleteModel: function(modelName, queryArgs, req, res, successMessage, sqlOptions) {
        models[modelName].forge()
            .where(queryArgs)
            .destroy(sqlOptions)
            .then(function () {
                res.json({error: false, data: {message: successMessage}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    grabNormalShiftRange: grabNormalShiftRange,
    getPatchKeysWithoutBannedKeys: getPatchKeysWithoutBannedKeys,
    getMark: getMark,
    setMark: setMark,
    clearMarks: clearMarks,
    createSelectQueryForAllColumns: createSelectQueryForAllColumns
};

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

function grabNormalShiftRange(from, after, before) {
    if (from === undefined) {
        from = new Date();
    }
    if (after === undefined) {
        after = moment(from)
            .subtract('1', 'months')
            .subtract('1', 'hour')
            .endOf('month')
            .unix();
    }
    if (before === undefined) {
        before = moment(from)
            .add('3', 'months')
            .add('1', 'hour')
            .startOf('month')
            .unix();
    }

    return [after, before];
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

    if (submark !== undefined) {
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

function createSelectQueryForAllColumns(modelName, tablename) {
    if (!schema.hasOwnProperty(modelName)) {
        throw new Error("Unknown model name: " + modelName);
    }

    var columns = [];
    _.each(_.keys(schema[modelName]), function(columnName) {
        columns.push(tablename + '.' + columnName + ' as ' + columnName);
    });

    return columns;
}
