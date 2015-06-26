var mongoose = require('mongoose'),
    //Schema = mongoose.Schema,
    Schema = require('./schema').Schema,
    ObjectId = Schema.ObjectId,
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    utils = require('./utils'),
    _ = require('underscore'),
    sqlite3 = require('sqlite3').verbose(),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var db_file = 'data/database.db';

mkdirp(path.dirname(db_file), function(err) {
    if (err) {
        console.info('Error creating data folder.');
    } else {
        console.info('Created data folder.');
    }
});

var knex = require('knex')( {
    dialect: 'sqlite3',
    connection: {
        filename: db_file
    }
});

var Bookshelf = require('bookshelf')(knex);

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

_.each(Schema, function(tableSchema, modelName) {
    // normalize name so that it can go into the database
    var normalizedTableName = lowercaseAndPluralizeModelName(modelName);
    // save normalized name for creating models after this loop
    modelNames[modelName] = normalizedTableName;
    tableNameToModelName[normalizedTableName] = modelName;

    knex.schema.hasTable(normalizedTableName).then(function(exists) {
        if (exists) {
            console.log(normalizedTableName + " table already exists");
        } else {
            return knex.schema.createTable(normalizedTableName, function(table) {
                _.each(tableSchema, function(columnSchema, columnName) {
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
                console.log("Successfully created " + normalizedTableName + " table");
            });
        }
    });
});

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
var customModelFunctions = {
    /*
    SomeModel: {
        wut: function() {
            // ...
        }
    }
    */
    User: {
        memberOfGroups: function() {
            return this.hasMany(models['Group']).through(models['UserGroup']);
        }
    }
};

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
        if (customModelFunctions[tableName] === undefined) {
            customModelFunctions[tableName] = {};
        }
        var thisCustomTablesFunctions = customModelFunctions[tableName];
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
                    throw "'belongsToMany' relationship NOT YET SUPPORTED";
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
                        throw "Cannot map foreign table to model: '" + foreignTableName + "'"
                    }

                    console.log(modelName + "." + methodName + "() = " + modelName + "." + relationMethodName + "(" + foreignModelName + ")");
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
    if (customModelFunctions[modelName] !== undefined) {
        // copy all custom functions into the new model
        _.extend(modelOptions, customModelFunctions[modelName]);
    }
    // create the new model
    models[modelName] = Bookshelf.Model.extend(modelOptions);
    // create the collection
    var pluralModelName = pluaralizeString(modelName);
    models[pluralModelName] = Bookshelf.Collection.extend({
        model: models[modelName]
    });
});

var User = Bookshelf.Model.extend({
    tableName: 'users'
});

var Shift = Bookshelf.Model.extend({
    tableName: 'shifts'
});
var Group = Bookshelf.Model.extend({
    tableName: 'groups'
});
var UserGroup = Bookshelf.Model.extend({
    tableName: 'usergroups'
});
var Token = Bookshelf.Model.extend( {
    tableName: 'tokens'
});
var GroupUserClass = Bookshelf.Model.extend({
    tableName: 'groupuserclasses'
});
var UserPermission = Bookshelf.Model.extend({
    tableName: 'userpermissions'
});
var Location = Bookshelf.Model.extend({
    tableName: 'locations'
});
var AreaLocation = Bookshelf.Model.extend({
    tableName: 'arealocations'
});
var Area = Bookshelf.Model.extend({
    tableName: 'areas'
});
var GroupAdditionalInformation = Bookshelf.Model.extend({
    tableName: 'groupadditionalinformation'
});
var GroupUserInformation = Bookshelf.Model.extend({
    tableName: 'groupUserInformation'
});

//Collections

var Users = Bookshelf.Collection.extend({
    model: User
});
var Shifts = Bookshelf.Collection.extend({
    model: Shift
});
var Groups = Bookshelf.Collection.extend({
    model: Group
});
var UserGroups = Bookshelf.Collection.extend({
    model: UserGroup
});
var Tokens = Bookshelf.Collection.extend({
    model: Token
});
var GroupUserClasses = Bookshelf.Collection.extend({
    model: GroupUserClass
});
var UserPermissions = Bookshelf.Collection.extend({
    model: UserPermission
});
var Locations = Bookshelf.Collection.extend({
    model: Location
});
var AreaLocations = Bookshelf.Collection.extend({
    model: AreaLocation
});
var Areas = Bookshelf.Collection.extend({
    model: Area
});
var GroupAdditionalInformations = Bookshelf.Collection.extend({
    model: GroupAdditionalInformation
});
var GroupUserInformations = Bookshelf.Collection.extend({
    model: GroupUserInformation
});


function consumeRememberMeToken(token, next) {
    console.log("trying to consume token..");
    return Token.query(function(q) {
        q.select('tokens.*')
            .innerJoin('users', function () {
                this.on('tokens.userid', '=', 'users.id')
                    .andOn('tokens.date', '>', new Date().getTime())
                    .andOn('tokens.token' , token)
            })
    })
        .fetch({require: true})
        .then(function(foundToken) {
            var userid = foundToken.get('userid');
            // Found a token, delete it
            return foundToken.destroy()
                .then(function() {
                    return next(null, userid);
                })
                .catch(function(err) {
                    console.log(err);
                    return next(null, null);
                });
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
    User.forge({id: uid})
        .fetch({require: true})
        .then(function(foundUser) {
            var expires = new Date();
            expires.setDate(expires.getDate() + tokens_expire_in_x_days);

            Bookshelf.knex('tokens')
                .where('date', '<', Date.now())
                .del()
                .then(function(numRows) {
                    if (numRows > 0) {
                        console.log('Purged ' + numRows + ' expired tokens.');
                    }
                })
                .catch(function(err) {
                    console.log('Failed to purge tokens.' + err);
                });

            var newToken = new Token({
                userid: foundUser.get('id'),
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

function issueToken(user, done) {
    var token = utils.randomString(64);
    return saveRememberMeToken(token, user.id, function(err) {
        if (err) { return done(err); }
        return done(null, token);
    });
}

/*
 db.serialize(function() {
 db.run("CREATE TABLE IF NOT EXISTS demo (runtime REAL)");

 db.run("INSERT INTO demo (runtime) VALUES (?)", new Date().getTime());

 db.each("SELECT runtime FROM demo", function(err, row) {
 console.log("This app was run at " + row.runtime);
 });

 });

 db.close();

var shiftSchema = new Schema({
    title:       {type: String},
    description: {type: String},
    allDay:      {type: Boolean, default: false},
    recurring:   {type: Boolean, default: false},
    start:       {type: Date, required: true},
    end:         {type: Date, required: true}
});

shiftSchema.pre('validate', function (next) {
    if (this.start > this.end)  {
        next(new Error('Ending time must be after starting time'));
    } else {
        next();
    }
});

var userSchema = new Schema({
    name:        {type: String, required: false},
    username:    {type: String, required: true, unique: true},
    email:       {type: String, required: true, unique: true},
    password:    {type: String, required: true},
    squestion:   {type: String, required: true},
    sanswer:     {type: String, required: true}
});

userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password') && !user.isModified('sanswer')) return next();

    var genSalt = function(array) {
        if (array.length == 0) {next();}
        var method = array.pop();
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user[method], salt, function(err, hash) {
                if(err) return next(err);
                user[method] = hash;
                genSalt(array);
            });
        });
    };

    var toModifiy = [];
    _.each(['password', 'sanswer'], function(element, index, list) {
        if (user.isModified(element)) {
            toModifiy.push(element);
        }
    });

    genSalt(toModifiy);
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.compareSAnswer = function(candidateSAnswer, cb) {
    bcrypt.compare(candidateSAnswer, this.sanswer, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.method('toJSON', function() {
    var user = this.toObject();
    delete user.password;
    delete user.squestion;
    delete user.sanswer;
    delete user.__v;
    return user;
});

Users = mongoose.model('Users', userSchema);

var groupSchema = new Schema({
    groupname:   {type: String, required: true, unique: true},
    squestion:   {type: String, required: true},
    sanswer:     {type: String, required: true}
});

groupSchema.pre('save', function(next) {
    var group = this;

    if(!group.isModified('sanswer')) return next();

    var genSalt = function(array) {
        if (array.length == 0) {next();}
        var method = array.pop();
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(group[method], salt, function(err, hash) {
                if(err) return next(err);
                group[method] = hash;
                genSalt(array);
            });
        });
    };

    var toModifiy = [];
    _.each(['sanswer'], function(element, index, list) {
        if (group.isModified(element)) {
            toModifiy.push(element);
        }
    });

    genSalt(toModifiy);
});

groupSchema.methods.compareSAnswer = function(candidateSAnswer, cb) {
    bcrypt.compare(candidateSAnswer, this.sanswer, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

groupSchema.method('toJSON', function() {
    var group = this.toObject();
    delete group.squestion;
    delete group.sanswer;
    delete group.__v;
    return group;
});

Groups = mongoose.model('Groups', groupSchema);

passport.serializeUser(function(user, done) {
    done(null, user.id);z
});

passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
        done(err, user);
    });
});


var tokenSchema = new Schema({
    _uid: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        unique: true,
        required: true},
    token: [{
        expires: {type: Date},
        key:     {type: String, unique: true}
    }]
});

// https://github.com/jaredhanson/passport-remember-me/blob/master/examples/login/server.js

var Token = mongoose.model('Token', tokenSchema);

function consumeRememberMeToken(token, next) {
    console.log("trying to consume token..");
    var query = {'token.key': token};
    Token.find(query, function(err, foundTokens) {
        if (!err) {
            if (foundTokens.length > 0) {
                var foundToken = foundTokens[0];

                var uid = foundToken._uid;
                var tokens = foundToken.token;
                if (tokens.length > 0) {
                    var now = Date.now();
                    for (var i = 0; i < tokens.length; i++) {
                        if (tokens[i].key == token) {
                            if (now < tokens[i].expires) {
                                // token is good, remove it
                                tokens.splice(i, 1);
                                foundToken.save();
                                return next(null, uid);
                            } else {
                                return next(null, uid);
                            }
                        }
                    }
                    // else didn't find any tokens, fallthrough below
                } else {
                    console.log("No tokens issued");
                    return next('No tokens issued for user', null);
                }
            }
        } // else an error occurred
        console.log("Failed to find token: " + token);
        Token.find({}, function(err, tokens) {
            console.log("Found tokens: ");
            console.log(tokens);
        });
        return next(null, null);
    });
}

var max_tokens = 2;
var tokens_expire_in_x_days = 14;

function saveRememberMeToken(token, uid, next) {
    Users.findById(uid, function(err, foundUser) {
        if (err) { return next(err); }
        Token.find({_uid: uid}, function (err2, foundTokens) {
            if (err2) {
                next(err2);
            } else {
                var expires = new Date();
                expires.setDate(expires.getDate() + tokens_expire_in_x_days);

                if (foundTokens.length == 0) {
                    var newToken = new Token({
                        _uid: foundUser.id,
                        token: [{
                            key: token,
                            expires: expires
                        }]
                    });

                    return newToken.save(next);
                } else {
                    var foundToken = foundTokens[0];
                    console.log("Saving token: " + token);
                    foundToken.token.push({
                        key: token,
                        expires: expires
                    });
                    var now = new Date();
                    foundToken.token = foundToken.token.filter(function (value, index, array) {
                        if (now > value.expires) {
                            console.log("Purging expired token: " + value.key + " that expired on " + value.expires);
                            return false;
                        } else {
                            return true;
                        }
                    });
                    while (foundToken.token.length > max_tokens) {
                        console.log("Removing token " + foundToken.token[0].key + " from database: reached maximum number of tokens for user (" + foundToken.token.length + "/" + max_tokens + ")");
                        foundToken.token.shift();
                    }
                    return foundToken.save(next);
                }
            }
        });
    });
}

function issueToken(user, done) {
    var token = utils.randomString(64);
    return saveRememberMeToken(token, user.id, function(err) {
        if (err) { return done(err); }
        return done(null, token);
    });
}

userSchema.post('save', function(next) {
    var user = this;
    // on password change, invalidate session tokens AND session
    if(user.isModified('password')) {
        // get user id and search for it in tokens
        var userId = user.id();
        Token.update({_uid: userId}, {$set: {token: []}}, function(err, affected) {
            if (err) {
                console.log('Failed to remove tokens for user ' + userId);
            } else {
                console.log('Removed tokens for ', affected);
            }
        });

        // we cannot reset sessions from within this context
        // it needs to be done in the controller
    }
});

var categorySchema = new Schema({
    name:        {type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true},
    parent:      {type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false}
});

var Category = mongoose.model('Category', categorySchema);

categorySchema.methods.children = function() {
    if (this.parent === undefined || this.parent === null) {
        return [];
    } else {
        return Category.find({parent: this._id})
    }
};

categorySchema.methods.addChild = function(name, next) {
    new Category({
        name: name,
        parent: this._id
    }).save(next);
};

var addChildrenToQueue = function(queue, existingChildren, parent) {
    _.each(parent.children, function(child, index, list) {
        if (child._id in existingChildren) {
            // skip this child, a loop exists
        } else {
            queue.push(child);
            existingChildren[child._id] = child;
        }
    });
};

categorySchema.pre('remove', function(next) {
    // remove children
    var children = {};
    var queue = [this];
    while (queue.length > 0) {
        var child = queue.shift();
        addChildrenToQueue(queue, children, child);
    }

    _.each(children, function(value, prop, index, list) {
        // TODO: IF THIS FAILS WE NEED TO RECOVER
        // SO DB IS ALWAYS IN A CONSISTENT STATE
        // MONGODB DOES NOT SUPPORT TRANSACTIONS
        Category.where().findOneAndRemove(function(err) {
            if (err) { next(err); }
        });
    });
});

categorySchema.pre('save', function(next) {
    var category = this;
    // on password change, invalidate session tokens AND session
    if (category.isModified('name')) {
        var name = category['name'];
        if (name === undefined ||
            name === null ||
            name === '') {
            next(new Error("Name cannot be empty"));
        }
    }
    next();
});

*/

var exports = {
    Bookshelf: Bookshelf,
    consumeRememberMeToken: consumeRememberMeToken,
    issueToken: issueToken
};

exports = _.extend(exports, models);

module.exports = exports;

