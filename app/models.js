var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
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
knex.schema.hasTable('users').then(function(exists) {
    if (exists) {
        console.log('Users table already exists.');
    } else {
        return knex.schema.createTable('users', function(table) {
            table.increments('id');
            table.string('name', 20)
                .notNullable();
            table.string('username', 20)
                .unique()
                .notNullable();
            table.string('email', 50)
                .unique()
                .notNullable();
            table.string('password', 100)
                .notNullable();
            table.string('squestion', 100)
                .notNullable();
            table.string('sanswer', 100)
                .notNullable();
        }).then(function() {
            console.log('Successfully created users table.');
        });
    }
});

knex.schema.hasTable('shifts').then(function(exists) {
    if (exists) {
        console.log('Shifts table already exists.');
    } else {
        return knex.schema.createTable('shifts', function(table) {
            table.increments('id');
            table.string('title', 30)
                .notNullable();
            table.string('description', 30);
            table.boolean('allDay')
                .defaultTo(false);
            table.boolean('recurring')
                .defaultTo(false);
            table.date('start')
                .notNullable();
            table.date('end')
                .notNullable();
        }).then(function() {
            console.log('Successfully created shifts table.');
        });
    }
});

knex.schema.hasTable('groups').then(function(exists) {
    if (exists) {
        console.log('Groups table already exists.');
    } else {
        return knex.schema.createTable('groups', function(table) {
            table.increments('id');
            table.string('groupname', 20)
                .unique()
                .notNullable();
            table.integer('ownerid')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
        }).then(function() {
            console.log('Successfully created groups table.');
        });
    }
});

knex.schema.hasTable('usergroups').then(function(exists) {
    if (exists) {
        console.log('Usergroups table already exists.');
    } else {
        return knex.schema.createTable('usergroups', function(table) {
            table.increments('id');
            table.integer('userid')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.integer('groupid')
                .references('id')
                .inTable('groups')
                .onDelete('CASCADE');
        }).then(function() {
            console.log('Successfully created usergroups table.');
        });
    }
});

knex.schema.hasTable('tokens').then(function(exists) {
    if (exists) {
        console.log('Tokens table already exists.');
    } else {
        return knex.schema.createTable('tokens', function(table) {
            table.increments('id');
            table.integer('userid')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .notNullable();
            table.string('token')
                .notNullable()
                .unique();
            table.date('date')
                .notNullable();
        }).then(function() {
            console.log('Successfully created usergroups table.');
        });
    }
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
var Usergroup = Bookshelf.Model.extend({
    tableName: 'usergroups'
});
var Token = Bookshelf.Model.extend( {
    tableName: 'tokens'
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
var Usergroups = Bookshelf.Collection.extend({
    model: Usergroup
});
var Tokens = Bookshelf.Collection.extend({
    model: Token
});


function consumeRememberMeToken(token, next) {
    console.log("trying to consume token..");
    var query = {'token.key': token};
    Tokens.forge(query)
        .fetchAll()
        .then(function(foundTokens) {
            if (foundTokens.length > 0) {
                var foundToken = foundTokens[0];

                var uid = foundToken.get('id');
                var tokens = foundToken.get('token');
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
        })
        .catch(function(err) {
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
    User.forge({id: uid})
        .fetch()
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
    Shift: Shift,
    Shifts: Shifts,
    Users: Users,
    User: User,
    Groups: Groups,
    Group: Group,
    Usergroups: Usergroups,
    Usergroup: Usergroup,
    Token: Token,
    consumeRememberMeToken: consumeRememberMeToken,
    issueToken: issueToken,
    //Category: Category

};

