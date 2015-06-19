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

//Create tables

_.each(Schema, function(tableSchema, tableName) {
    knex.schema.hasTable(tableName).then(function(exists) {
        if (exists) {
            console.log(tableName + " table already exists");
        } else {
            return knex.schema.createTable(tableName, function(table) {
                _.each(tableSchema, function(columnSchema, columnName) {
                    var column;
                    if (columnSchema.hasOwnProperty('type')) {
                        if (columnSchema.type == "string" && columnSchema.hasOwnProperty("maxlen")) {
                            column = table.string(columnName, columnSchema.maxlen);
                        } else {
                            column = table[columnSchema.type](columnName);
                        }
                    } else {
                        throw "Table " + tableName + "'s column " + columnName + " needs a type attribute";
                    }
                    if (columnSchema.hasOwnProperty('nullable')) {
                        var nullable = columnSchema.nullable;
                        if (!nullable) {
                            column = column.notNullable();
                        }
                    }
                    if (columnSchema.hasOwnProperty('unique')) {
                        var unique = columnSchema.unique;
                        if (unique) {
                            column = column.unique();
                        }
                    }
                    if (columnSchema.hasOwnProperty('references')) {
                        column = column.references(columnSchema['references']);
                    }
                    if (columnSchema.hasOwnProperty('inTable')) {
                        column = column.inTable(columnSchema['inTable']);
                    }
                    if (columnSchema.hasOwnProperty('onDelete')) {
                        column = column.onDelete(columnSchema['onDelete']);
                    }
                });
                console.log("Successfully created " + tableName + " table");
            });
        }
    });
});

//Models

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

module.exports = {
    Bookshelf: Bookshelf,
    Shift: Shift,
    Shifts: Shifts,
    Users: Users,
    User: User,
    Groups: Groups,
    Group: Group,
    Usergroups: UserGroups,
    Usergroup: UserGroup,
    Token: Token,
    consumeRememberMeToken: consumeRememberMeToken,
    issueToken: issueToken
    //Category: Category

};

