var Schema = require('./schema').Schema,
    ObjectId = Schema.ObjectId,
    bcrypt = require('bcrypt-nodejs'),
    passport = require('passport'),
    utils = require('./utils'),
    _ = require('underscore'),
    sqlite3 = require('sqlite3').verbose(),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    platformMap = require('./notifications').platformMap,
    Promise = require('bluebird'),
    config = require('config'),
    validations = require('../ionic/www/js/shared/Validation.js'),
    Validator = require('bookshelf-validator'),
    ValidationError = Validator.ValidationError,
    moment = require('moment'),
// TODO: move encryption file to this folder if encrypting with bookshelf events turns out to work well
    encryptKey = require('../controllers/encryption/encryption').encryptKey,
    time = require('./time'),
    SALT_WORK_FACTOR = 10;

var neverDropAllTables = false; // safety setting later for production
function okToDropAllTables() {
    return global.okToDropTables || false;
}

var db_file = './data/database.db';
if (config.has("dbConfig.file")) {
    db_file = config.get("dbConfig.file");
}

mkdirp(path.dirname(db_file), function(err) {
    if (err) {
        console.info('Error creating data folder.');
    } else {
        //console.info('Data folder exists');
    }
});

if (global.okToDropTables) {
    console.log("WARNING: Dropping of tables ENABLED");
}

var dbConnection = {};

if (process.env.DATABASE_URL !== undefined ||
    (config.has("dbConfig.url")
    && config.get("dbConfig.url") !== null)
    && config.get("dbConfig.url") != '') {
    // running in heroku?
    var re = /([^:]):\/\/([^:]*):([^@]*)@([^:]*):(\d*)\/(.*)/;
    var match;

    var url = process.env.DATABASE_URL;
    if (url === undefined) {
        url = config.get("dbConfig.url");
    }

    if ((match = re.exec(url)) !== null) {
        if (match.index === re.lastIndex) {
            re.lastIndex++;
        }
        console.log("Seem to be running in heroku, trying to connect to database");

        switch(match[1]) {
            case 'postgres':
                global.db_dialect = 'pg';
                break;
            case 'mysql':
                global.db_dialect = 'mysql';
                break;
            default:
                console.log("Unknown database type: " + match[1]);
                global.db_dialect = 'pg';
        }
        global.db_user = match[2];
        global.db_password = match[3];
        global.db_host = match[4];
        global.db_port = match[5];
        global.db_database = match[6];
        global.db_ssl = true;
    } else {
        console.log("WARNING: DATABASE_URL is of the INCORRECT FORMAT");
    }
} else {
    _.each({
        db_dialect: "dbConfig.dialect",
        db_host: "dbConfig.host",
        db_port: "dbConfig.port",
        db_user: "dbConfig.user",
        db_password: "dbConfig.password",
        db_database: "dbConfig.database",
        db_ssl: "dbConfig.ssl"
    }, function(configName, globalName) {
        if (config.has(configName)) {
            global[globalName] = config.get(configName);
        }
    });
}

if ((global.db_dialect || 'sqlite3') == 'sqlite3') {
    dbConnection.filename = db_file;
} else {
    dbConnection.host = global.db_host;
    dbConnection.user = global.db_user;
    if (global.db_port !== undefined) {
        dbConnection.port = global.db_port;
    }
    dbConnection.password = global.db_password;
    dbConnection.database = global.db_database;
    if (global.db_ssl !== undefined) {
        dbConnection.ssl = global.db_ssl;
    }
}

console.log(dbConnection);

var knex = require('knex')( {
    dialect: global.db_dialect || 'sqlite3',
    connection: dbConnection
    //, debug: true
});

var Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin(Validator.plugin);

function lowercaseAndPluralizeModelName(name) {
    // lower case
    name = name.toLowerCase();
    // and pluralize it
    return pluaralizeString(name);
}

function pluaralizeString(string) {
    var downcased = string.toLowerCase();
    // if a word ends in ‑s, ‑sh, ‑ch, ‑x, or ‑z, you add ‑es
    // else: add s
    var lastCharacterOfString = downcased.substr(downcased.length - 1);
    var plural;

    if (downcased.length >= 2) {
        var lastTwoCharactersOfString = downcased.substr(downcased.length - 2);
        switch (lastTwoCharactersOfString) {
            case 'sh':
            case 'ch':
                plural = 'es';
        }
    }

    if (plural === undefined) {
        switch(lastCharacterOfString) {
            case 's':
            case 'x':
            case 'z':
                plural = 'es';
                break;
            default:
                plural = 's';
        }
    }

    return string + plural;
}


var models = {};
var modelNames = {};
var tableNameToModelName = {};
var relations = {};

// Process schema and create relation information
// This must be done here instead of inside the actual creation of tables because
// the tables are created inside a promise which means, asynchronously
_.each(Schema, function(tableSchema, modelName) {
    // normalize name so that it can go into the database
    var normalizedTableName = lowercaseAndPluralizeModelName(modelName);
    // save normalized name for creating models after this loop
    modelNames[modelName] = normalizedTableName;
    tableNameToModelName[normalizedTableName] = modelName;
    _.each(tableSchema, function(columnSchema, columnName) {
        var unique = false;
        if (columnSchema.hasOwnProperty('unique')) {
            unique = columnSchema.unique;
            if (unique) {
                unique = true;
            }
        }
        if (columnSchema.hasOwnProperty('inTable')) {
            var foreignTable = columnSchema['inTable'];
            // create relation
            // table name must be normalized because that is how inTable values should be
            if (relations[normalizedTableName] === undefined) {
                relations[normalizedTableName] = {}
            }

            var relationType = 'hasOne';
            if (!unique) {
                relationType = 'hasMany';
            }

            if (relations[normalizedTableName][relationType] === undefined) {
                relations[normalizedTableName][relationType] = [];
            }

            if (relations[foreignTable] === undefined) {
                relations[foreignTable] = {}
            }

            if (relations[foreignTable][relationType] === undefined) {
                relations[foreignTable][relationType] = [];
            }

            // later this will be used to determine if the relationship is one or many
            relations[foreignTable][relationType].push(normalizedTableName);

            var belongsTo = 'belongsTo';
            // TODO: belongsToMany uses a separate table specifically named so must be detected differently, see: http://bookshelfjs.org/#Model-belongsToMany
            if (relations[normalizedTableName][belongsTo] === undefined) {
                relations[normalizedTableName][belongsTo] = [];
            }
            relations[normalizedTableName][belongsTo].push(foreignTable);

        }
    });
});

// Create tables
var initDbPromise = null;

function tableCreated() {
    tablesCreated += 1;
    if (tablesCreated >= tablesBeingCreated) {
        // resolve promise
    }
}

var firstInitialization = true;

function getListOfNonExistingTables(trx, next) {
    var nonExistingTables = {};

    var current = trx;
    if ('schema' in current) {
        current = current.schema;
    }

    var tablesToCheck = [];
    _.each(Schema, function(tableSchema, modelName) {
        tablesToCheck.push(modelName);
    });

    function recurse() {
        if (tablesToCheck.length == 0) {
            return next(nonExistingTables);
        } else {
            var modelName = tablesToCheck.shift();
            var tableName = lowercaseAndPluralizeModelName(modelName);
            return trx.schema.hasTable(tableName).then(function (exists) {
                if (!exists) {
                    nonExistingTables[modelName] = Schema[modelName];
                }

                return recurse();
            });
        }
    }

    return recurse();
}

var specialFields = {};
var specialFieldList = {
    'encrypt': function(fields) {
        this.on('saving', function (model, attrs, options) {
            _.each(fields, function (columnDefinition, columnName) {
                var value = model.get(columnName);
                /*
                 // Is this needed? What is the point of the attrs argument
                 if (attrs.hasOwnProperty(columnName)) {
                 value = attrs[columnName];
                 }
                 */

                if (value !== undefined) {
                    // encrypt
                    model.set(columnName, encryptKey(value));
                }
            });
        });
    },
    'lowercase': function(fields) {
        this.on('saving', function (model, attrs, options) {
            _.each(fields, function (columnDefinition, columnName) {
                var value = model.get(columnName);
                model.set(columnName, value.toLowerCase());
            });
        });
    }
};

function initDb(dropAllTables) {

    if (dropAllTables) {
        if (!okToDropAllTables()) {
            var msg = "WARNING: ALL TABLES WERE SET TO BE DROPPED BUT CONFIGURATION PREVENTED THIS";
            console.log(msg);
            return Promise.reject(msg);
        }
    }

    if (!firstInitialization) {
        // check if there is a currently running instance of this method
        if (initDbPromise !== null) {
            // existing promise exists
            // it could be resolved already
            // or it might not be resolved
            return onDatabaseReady(function() {
                // other initDb either just finished or was already finished
                // delete the old promise and recurse to finish stuff\
                return initDb(dropAllTables);
            });
        }
    }

    firstInitialization = false;

    var transactionCompletedPromise = new Promise(function(resolve) {
        if (!dropAllTables) {
            // apparently we cannot do hasTable() calls within a transaction
            // so.. since this method should only have one copy of it running
            // we can query which tables dont exist BEFORE the transaction
            return getListOfNonExistingTables(knex, function(nonExistingTables) {
                return createTablesInATransaction(nonExistingTables, nonExistingTables);
            });
        } else {
            // create all the tables because we will be dropping them all
            return getListOfNonExistingTables(knex, function(nonExistingTables) {
                return createTablesInATransaction(Schema, nonExistingTables);
            });
        }
        function createTablesInATransaction(Schema, nonExistingTables) {
            knex.transaction(function (trx) {
                var current = trx.schema;
                if (dropAllTables) {
                    // drop all tables and keep chaining the commands
                    var tablesToDropInReversedOrder = [];
                    // drop tables in reverse order
                    // in postgres (and mysql maybe) ordering of table creation matters
                    // so does deletion
                    // we cannot delete a table if there are other tables depending on it
                    // so, delete them in reverse order which should work.
                    _.each(Schema, function (tableSchema, modelName) {
                        tablesToDropInReversedOrder.unshift(modelName);
                    });
                    _.each(tablesToDropInReversedOrder, function (modelName) {
                        var tableSchema = Schema[modelName];
                        var tableName = lowercaseAndPluralizeModelName(modelName);
                        if (!nonExistingTables.hasOwnProperty(modelName)) {
                            current = current.dropTable(tableName);
                        }
                    });
                    return current.then(function () {
                        // now create all the tables that they have been dropped successfully
                        // we are using the same transaction but have executed the sql
                        current = trx.schema;
                        return createTables(Schema);
                    })
                } else {
                    // no tables to drop, just create them
                    return createTables(Schema);
                }

                function createTables(tables) {
                    _.each(tables, function (tableSchema, modelName) {
                        // normalize name so that it can go into the database
                        var normalizedTableName = lowercaseAndPluralizeModelName(modelName);
                        // save normalized name for creating models after this loop
                        modelNames[modelName] = normalizedTableName;
                        tableNameToModelName[normalizedTableName] = modelName;
                        current = current.createTable(normalizedTableName, function (table) {
                            _.each(tableSchema, function (columnSchema, columnName) {
                                var column;
                                // check each type of method that requires special behavior
                                // then do that special behavior
                                if (columnSchema.hasOwnProperty('type')) {
                                    // string requires maxlen arg
                                    if (columnSchema.type == "string" && columnSchema.hasOwnProperty("maxlen")) {
                                        column = table.string(columnName, columnSchema.maxlen);
                                    } else {
                                        column = table[columnSchema.type](columnName);
                                    }
                                } else {
                                    throw "Table " + normalizedTableName + "'s column " + columnName + " needs a type attribute";
                                }
                                if (columnSchema.hasOwnProperty('nullable')) {
                                    var nullable = columnSchema.nullable;
                                    if (!nullable) {
                                        column = column.notNullable();
                                    }
                                }
                                if (columnSchema.hasOwnProperty('unique')) {
                                    if (columnSchema.unique) {
                                        column = column.unique();
                                    }
                                }
                                if (columnSchema.hasOwnProperty('references')) {
                                    column = column.references(columnSchema['references']);
                                }
                                if (columnSchema.hasOwnProperty('inTable')) {
                                    var foreignTable = columnSchema['inTable'];
                                    column = column.inTable(foreignTable);
                                }
                                if (columnSchema.hasOwnProperty('onDelete')) {
                                    column = column.onDelete(columnSchema['onDelete']);
                                }
                            });
                        });
                    });
                    resolve();
                    return current;
                }
            });
        }
    });

    initDbPromise = transactionCompletedPromise;
    initDbPromise.tap(function() {
        initDbPromise = null;
    });

    return transactionCompletedPromise;
}

if (firstInitialization) {
    initDb(false).then(function() {
        //console.log("Completed initial initialization of the database.");
    })
}

function databaseReadyMiddleware(req, res, next) {
    return onDatabaseReady(function(err) {
        if (err) {
            req.status(500)
                .json({error: true, data: {message: err}});
        } else {
            return next();
        }
    });
}

function onDatabaseReady(fn) {
    if (initDbPromise === null) {
        return fn();
    } else if (!initDbPromise.isPending()) {
        // might happen in extremely rare cases
        // because we set the promise to null when it resolves
        // something *could* *maybe* be run before the tap method runs

        // note that checkign if it is pending or not is not atomic
        // so the following else statement would normally not be safe
        // but since javascript is single threaded this is OK to do
        // as nothing will be interrupting us
        return fn();
    } else {
        return initDbPromise
            .then(function() {
                return fn();
            })
            .catch(function(err) {
                console.log(err);
                return fn(err);
            });
    }
}

// tablesBeingCreated started at 1
// this is so that we can guarantee that the loop gets finished before the promise gets resolved

var throughRelations = {};
/*
function recursivelyFindThroughRelations(maxDepth, depth, listOfListOfTablePaths, visitedTables, allRelations, listOfRelatedTable, relationMethod) {
    if (maxDepth > depth) {
        return false;
    } else {
        var result = false;

        _.each(listOfRelatedTable, function (individualRelatedTable) {
            // check if the related table has a relation that we want to follow
            // if it does then we need to add it to a temporary list and recurse with it
            // if it returns true then we push it to the list we got
            // and then we return true
            if (!individualRelatedTable in visitedTables) {
                // this table has not been visited yet
                // see if it has anything worthwhile
                // worthwhile meaning:

                visitedTables.push(individualRelatedTable);

                var recurseResult = recursivelyFindThroughRelations(maxDepth, depth + 1, listOfListOfTablePaths, visitedTables, allRelations, listOfRelatedTable );

                visitedTables.pop();
            }
        });

        return result;
    }
}
*/
/**
 * relations is of the format:
    {
        tableName: {
            relationMethod: [
                foreignTableName
            ]
        }
    }
 */
/*
function addThroughRelation(table, listOfMethods) {
    if (throughRelations[table] === undefined) {
        throughRelations[table] = {};
    }

    throughRelations[table]
}
// this is taking too much time to code, left here for possible future use
_.each(relations, function(relationTypeHash, normalizedTableName) {
    // normalizedTableName is the current tableName that we want to process from
    // relationTypeHash should be a hash of relationMethod => array of foreign table names
    if (throughRelations[normalizedTableName] === undefined) {
        throughRelations[normalizedTableName] = {};
    }

    var hasRelations = [];

    _.each(relationTypeHash, function(relatedTableList, relationMethod) {
        // relationMethod = 'belongsTo' || 'hasOne' || 'hasMany' || 'belongsToMany'
        // relatedTableList = [foreignTable1, foreignTable2]

        // hasOne
        // hasMany
        // belongsTo
        if (throughRelations[normalizedTableName][relationMethod] === undefined) {
            // the idea is to make a list of lists
            // we will push a list of how to get to the table onto that list
            // the expected format will be
            // ['hasMany', Model, 'through', IntermediaryModel]
            throughRelations[normalizedTableName][relationMethod] = [];
        }
        var currentlyProcessingThroughRelationTarget = throughRelations[normalizedTableName][relationMethod];
        // push how to get to the through relation on to a list then push the list on to the relationType list
        var possibleRelation = [relationMethod];

        var hasMany = relationMethod == 'hasMany';

        // iterate through the relatedTableList and check if those tables have a 'hasMany' || 'hasOne' relation
        // consider that our relation for now until more complex methods are setup
        if (relatedTableList !== undefined) {
            _.each(relatedTableList, function(individualRelatedTable) {
                // grab this tables relations
                var relatedTablesRelations = relations[individualRelatedTable];
                // relatedTablesRelations is a relationTypeHash: relationMethod => relatedTableList
                if (relatedTablesRelations !== undefined) {
                    var filteredRelatedTableRelations = _.reject(relatedTablesRelations, function(relatedTablesRelatedTables, relatedTablesRelation) {
                        return (relatedTablesRelation != 'belongsTo' && relatedTablesRelation != 'belongsToMany');
                    });

                    _.each(filteredRelatedTableRelations, function(relatedTablesRelatedTables, relatedTablesRelation) {
                        // each relation in this list will become a through relation
                        var localHasMany = hasMany ? relatedTablesRelation == 'hasMany':false;
                        var modifiedRelation = localHasMany ? 'hasMany':'hasOne';
                        currentlyProcessingThroughRelationTarget.push([modifiedRelation, individualRelatedTable, relatedTablesRelation, ])
                    });
                }
            });
        }

        // for now just go one table deep to see if idea works
        recursivelyFindThroughRelations(1, 0, possibleRelation, relations, relatedTableList, relationMethod);
    });

});
*/
// Custom functions that will be added to Models
// models will below have all relations added
// to them dynamically based upon schema
var customModelRelations = {
    /*
    SomeModel: {
        wut: function() {
            // ...
        }
    }
    */
    User: {
        memberOfGroups: function() {
            return this.belongsToMany(models['Group']).through(models['UserGroup']);
        },
        memberOfLocations: function() {
            return this.belongsToMany(models['Location']).through(models['UserPermission']);
        },
        locationBasedGroupPermissions: function() {
            return this.belongsToMany(models['GroupPermission']).through(models['UserPermission']);
        },
        groupBasedGroupPermissions: function() {
            return this.belongsToMany(models['GroupPermission']).through(models['UserGroups']);
        }
    },
    Group: {
        groupPermissions: function() {
            return this.belongsToMany(models['GroupPermission']).through(models['GroupSetting']);
        }
    }
};

var customModelFunctions = {
    User: {
        getLocationPermissions: function(trx, user_id, location_id, next, err) {
            // select grouppermissions.permissionlevel from userpermissions inner join grouppermissions on userpermissions.grouppermission_id = grouppermissions.id where userpermissions.user_id = 1 and userpermissions.location_id = 1;
            return models['GroupPermission'].query(function(q) {
                q.select('grouppermissions.permissionlevel').innerJoin('userpermissions', function() {
                    this.on('userpermissions.grouppermission_id', '=', 'grouppermissions.id')
                })
                    .where('userpermissions.user_id', '=', user_id)
                    .andWhere('userpermissions.location_id', '=', location_id);
            })
                .fetch()
                .then(function(result) {
                    if (result !== null) {
                        result = result.get('permissionlevel');
                        //console.log(result);
                    }
                    return next(result);
                })
                .catch(function(err_) {
                    err(err_);
                });
        }
    }
};

global.getLocationPermissions = customModelFunctions.User.getLocationPermissions;

//Models
_.each(modelNames, function(tableName, modelName) {
    // common options for every model
    var modelOptions = {
        tableName: tableName
    };

    //console.log("Processing " + tableName + " relations");

    // add relation methods
    if (relations[tableName] !== undefined) {
        // grab the object holds custom functions for this Model
        if (customModelRelations[tableName] === undefined) {
            customModelRelations[tableName] = {};
        }
        var thisCustomTablesFunctions = customModelRelations[tableName];
        // pre-compute the lowercase version of the current Model name for use inside the loop
        var singularLowerCaseModelName = modelName.toLowerCase();
        _.each(relations[tableName], function(listOfTables, relationMethodName) {
            // relationMethodName contains either belongsTo, hasOne or hasMany
            // listOfTables is the list of tables that need to use that method
            // what we need to do is generate methods on the Models with the table names
            // the table names need to either be plural for many relationships
            // or singular for singular relationships

            // determine if relationship is many or singular
            var isManyRelationship = relationMethodName.toLowerCase().indexOf('many') >= 0;

            // iterate over all the foreign tables that need to use this relationMethodName
            _.each(listOfTables, function(foreignTableName) {
                // make plural method name explicit so I can read this code later
                var pluralLowerCaseTableName = foreignTableName;
                // grab the foreign model name for the foreign table
                // the real foreign model will have to be referenced through models[foreignModelName]
                // because that object should be empty at the moment
                var foreignModelName = tableNameToModelName[foreignTableName];
                var singularLowerCaseForeignModelName = foreignModelName.toLowerCase();
                // ending result that will become the method name
                var methodName;

                // see http://bookshelfjs.org/#Associations if confused
                if (relationMethodName == 'belongsTo') {
                    methodName = singularLowerCaseForeignModelName;
                } else if (relationMethodName == 'belongsToMany') {
                    throw new Error("'belongsToMany' relationship NOT YET SUPPORTED");
                } else {
                    if (isManyRelationship) {
                        // many relationships should be named with plural and be lowercase
                        // it will return an array
                        methodName = pluralLowerCaseTableName;
                    } else {
                        // singular relationship should be singular based
                        // it will return one object
                        methodName = singularLowerCaseModelName;
                    }
                }

                // check if this method will not be overwritten below
                if (thisCustomTablesFunctions[methodName] === undefined) {
                    // it wont be overwritten!
                    if (foreignModelName === undefined) {
                        throw new Error("Cannot map foreign table to model: '" + foreignTableName + "'");
                    }

                    if (global.silent !== true) {
                        console.log(modelName + "." + methodName + "() = " + modelName + "." + relationMethodName + "(" + foreignModelName + ")");
                    }
                    modelOptions[methodName] = function() {
                        var model = models[foreignModelName];
                        // this will be either
                        // this.hasOne(model)
                        // this.hasMany(model)
                        // this.belongsTo(model)
                        return this[relationMethodName](model);
                    };
                }
            });
        });
    }

    // add custom specific methods, relations may be overridden
    if (customModelRelations[modelName] !== undefined) {
        // copy all custom functions into the new model
        _.extend(modelOptions, customModelRelations[modelName]);
    }
    // setup bookshelf-validator
    var validationOptions = getValidationOptionsForModelName(modelName);
    if (validationOptions !== undefined) {
        modelOptions = _.extend(_.clone(modelOptions), {validation: validationOptions});
    }

    // check if this model has any 'secret' keys
    if (Schema[modelName] !== undefined) {
        // iterate over keys (columns) and values (column definitions)
        // looking for a value with a 'encrypt' attribute
        _.each(Schema[modelName], function(columnDefinition, columnName) {
            // columnDefinition will be an object
            _.each(specialFieldList, function(valueFunction, property) {
                if (columnDefinition.hasOwnProperty(property)) {
                    if (specialFields[property] === undefined) {
                        specialFields[property] = {};
                    }
                    if (!specialFields[property].hasOwnProperty(modelName)) {
                        specialFields[property][modelName] = {};
                    }

                    specialFields[property][modelName][columnName] = columnDefinition;
                }
            });
        });
    }

    _.each(specialFieldList, function(valueFunction, property) {
        if (specialFields[property] !== undefined) {
            if (specialFields[property][modelName] !== undefined) {
                var fields = specialFields[property][modelName];
                modelOptions = _.extend(modelOptions, {
                    constructor: function () {
                        Bookshelf.Model.prototype.constructor.apply(this, arguments);
                        _.bind(valueFunction, this)(fields);
                    }
                });
            }
        }
    });

    // create the new model
    models[modelName] = Bookshelf.Model.extend(modelOptions);
    // create the collection
    var pluralModelName = pluaralizeString(modelName);
    models[pluralModelName] = Bookshelf.Collection.extend({
        model: models[modelName]
    });
});

function getValidationOptionsForModelName(modelName) {
    if (validations.hasOwnProperty(modelName)) {
        return validations[modelName];
    }

    return undefined;
}

function consumeRememberMeToken(token, next) {
    return models.Token.query(function(q) {
        q.select('tokens.*')
            .innerJoin('users', function () {
                this.on('tokens.user_id', '=', 'users.id');
            })
            .where('tokens.token', '=', token)
            .andWhere('tokens.date', '>', time.nowInUtc());
    })
        .fetch({require: true})
        .then(function(foundToken) {
            var user_id = foundToken.get('user_id');
            return next(null, user_id);
            // Found a token, delete it
            /*
            return foundToken.destroy()
                .then(function() {
                    return next(null, user_id);
                })
                .catch(function(err) {
                    return next(null, null);
                });
                */
        })
        .catch(function(err) {
            console.log(err);
            return next(null, null);
        });
}


var max_tokens = 2;
var tokens_expire_in_x_days = 14;

function saveRememberMeToken(token, uid, next) {
    if (uid === undefined ||
        uid === null ||
        uid == '') {
        return next("Cannot save token without a userid");
    }
    models.User.forge({id: uid})
        .fetch({require: true})
        .then(function(foundUser) {
            var expires = new moment().add(tokens_expire_in_x_days, 'days').unix();

            Bookshelf.knex('tokens')
                .where('date', '<', time.nowInUtc())
                .del()
                .then(function(numRows) {
                    if (numRows > 0) {
                        console.log('Purged ' + numRows + ' expired tokens.');
                    }
                })
                .catch(function(err) {
                    console.log('Failed to purge tokens.' + err);
                });

            var newToken = new models.Token({
                user_id: foundUser.get('id'),
                token: token,
                date: expires
            });

            newToken.save();
            return next();
            })
        .catch(function(err) {
            return next(err);
        })
}

function registerDeviceIdForUser(user_id, device_id, platformstr, expires, next) {
    if (device_id === undefined || device_id === null) {
        next(false);
    } else {
        var platform_id = 0; // 0 = browser
        if (platformstr) {
            platformstr = platformstr.toLowerCase();
            var platformType = _.keys(platformMap);
            for (var i = 0; i < platformType.length; i++) {
                if (platformType[i] == platformstr) {
                    platform_id = platformMap[platformType[i]];
                    break;
                }
            }
            if (platform_id === 0) {
                console.log("Unknown platform type received: " + platformstr);
            }
        }
        Bookshelf.transaction(function (t) {
            var tokenData = {
                token: device_id,
                user_id: user_id,
                platform: platform_id,
                date: time.nowInUtc(),
                expires: expires
            };
            return models.PushToken.forge({
                token: device_id
            })
                .fetch({
                    transacting: t
                })
                .then(function(pushToken) {
                    if (pushToken) {
                        if (pushToken.get('user_id') != user_id ||
                            pushToken.get('platform') != platform_id) {
                            // TODO: Destroy the row first then create it so create at timestamps are accurate maybe?
                            return pushToken.save(tokenData,
                                {
                                    transacting: t,
                                    patch: true
                                })
                                .then(function(pushToken) {
                                    next(true);
                                })
                                .catch(function(err) {
                                    next(false, err);
                                })
                        }
                        // pushToken exists
                        next(true);
                    } else {
                        // pushToken does not exist
                        return models.PushToken.forge(tokenData)
                            .save(null,
                            {
                                transacting: t
                            })
                            .then(function(savedPushToken) {
                                next(true);
                            })
                            .catch(function(err) {
                                next(false, err);
                            });
                    }
                })
                .catch(function(err) {
                    next(false, err);
                });
        });
    }
}

function issueToken(user, done) {
    var token = utils.randomString(64);
    return saveRememberMeToken(token, user.id, function(err) {
        if (err) { return done(err); }
        return done(null, token);
    });
}

// Method that combines multiple arrays of objects
// the first argument will be the key to consider unique in the resultant array
// key, list1, list2, ...
function combineArraysAndOmitDuplicates() {
    var result = [];

    var key = arguments[0];

    // each argument should be a JSON array that contains objects that need to be combined but omit duplicates
    // the objects in the array should all have an 'id' attribute
    // it will be this attribute that we use a hash map to identify duplicates
    var idToObject = {};

    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] !== undefined &&
            arguments[i] !== null &&
            arguments[i].length > 0) {
            _.each(arguments[i], function(item) {
                var id = item[key];
                if (id !== undefined) {
                    if (idToObject.hasOwnProperty(id)) {
                        // duplicate
                    } else {
                        idToObject[id] = item;
                    }
                } else {
                    // unknown property to compare on
                    result.push(item)
                }
            });
        }
    }

    _.each(idToObject, function(value, key) {
        // reuse result array
        // the array will be out of order but that is OK
        // the client should not care anyway when it decodes the JSON result
        result.push(value);
    });

    return result;
}

var exports = {
    Bookshelf: Bookshelf,
    consumeRememberMeToken: consumeRememberMeToken,
    registerDeviceIdForUser: registerDeviceIdForUser,
    issueToken: issueToken,
    combineRelationResults: combineArraysAndOmitDuplicates,
    knex: knex,
    initDb: initDb,
    onDatabaseReady: onDatabaseReady,
    databaseReadyMiddleware: databaseReadyMiddleware
};

exports = _.extend(exports, models);

module.exports = exports;

