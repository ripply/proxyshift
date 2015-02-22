var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    utils = require('./utils'),
    _ = require('underscore'),
    SALT_WORK_FACTOR = 10;

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
    delete user.__v;
    return user;
});

Users = mongoose.model('Users', userSchema);

passport.serializeUser(function(user, done) {
    done(null, user.id);
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

var categorySchema = new Schema({
    name:        {type: String,
                  unique: true,
                  lowercase: true,
                  trim: true},
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

module.exports = {
    Shift: mongoose.model('Shift', shiftSchema),
    Users: Users,
    Token: Token,
    Category: Category,

    consumeRememberMeToken: consumeRememberMeToken,
    issueToken: issueToken
};

