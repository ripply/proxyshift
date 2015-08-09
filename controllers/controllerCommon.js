var schema = require('../app/schema').Schema,
    _ = require('underscore');

var defaultBannedKeys = ['id'];

module.exports = {
    updateModel: function(modelName, bookshelfFetchedModelObject, updatedData, bannedKeys) {
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
};
