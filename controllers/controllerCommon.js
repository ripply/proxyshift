var schema = require('../app/schema').Schema,
    models = require('../app/models'),
    _ = require('underscore');

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
    updateModel: updateModel,
    patchModel: function(modelName, queryArgs, req, res, updateMessage, defaultExcludes, sqlOptions) {
        if (defaultExcludes === undefined) {
            defaultExcludes = ['id'];
        }
        models[modelName].forge(queryArgs)
            .fetch(sqlOptions)
            .then(function (fetchedResult) {
                if (!fetchedResult) {
                    audit(req, "Couldn't find: " + modelName + ": " + JSON.stringify(queryArgs));
                    res.sendStatus(403);
                } else {
                    var updated = updateModel(modelName, fetchedResult, req.body, defaultExcludes);
                    fetchedResult.save(
                        updated,
                        sqlOptions
                    )
                        .then(function () {
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
    deleteModel: function(modelName, queryArgs, req, res, successMessage) {
        models[modelName].forge()
            .where(queryArgs)
            .destroy()
            .then(function () {
                res.json({error: false, data: {message: successMessage}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
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
