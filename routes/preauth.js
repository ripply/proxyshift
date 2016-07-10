var middleware = require('./misc/middleware'),
    _ = require('underscore'),
    models = require('../app/models'),
    Notifications = models.Notifications,
    time = require('../app/time'),
    users = require('../controllers/users'),
    error = require('../controllers/controllerCommon').error,
    appLogic = require('../app'),
    passport = require('passport');

require('./../app/configure_passport');

var ensureCsrf = middleware.ensureCsrf;
var requireJson = middleware.requireJson;
var ensureAuthenticated = middleware.ensureAuthenticated;
var ensureDatabaseReady = models.databaseReadyMiddleware;
var logout = middleware.logout;
var isLoggedIn = middleware.isLoggedIn;
var notLoggedIn = middleware.notLoggedIn;

module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        preauthRouter = express.Router(),
        home = require('../controllers/home'),
        users = require('../controllers/users');

    var maxAgeInMs = 604800000;

    /*
    app.use(function(req, res, next) {
        console.log('Received request');
        next();
    });
    */

    app.get('/', home.index);

    // middleware to ensure that database is in an OK state for each request
    app.use(ensureDatabaseReady);

    app.get('/csrf', function(req, res, next) {
        console.log("Issuing new csrf token...");
        res.cookie('XSRFTOKEN', req.csrfToken());
        console.log(req.session);
        res.send(200);
        console.log("Sent 200 response");
    });

    app.get('/api/ping', function(req, res, next) {
        res.sendStatus(200);
    });

    // return current server time in utc
    app.get('/api/utc', function(req, res, next) {
        res.status(200).send('' + time.nowInUtc());
    });

    // check that client's time is close enough to server's
    app.post('/api/utc', function(req, res, next) {
        var currentTimeInUtc = time.nowInUtc();
        var keys = Object.keys(req.body);
        var clientsTimeInUtc;

        if (keys.length > 0) {
            clientsTimeInUtc = parseInt(keys[0]);
        }

        if (isNaN(clientsTimeInUtc)) {
            res.status(400).send('' + currentTimeInUtc);
        } else {
            var delta = currentTimeInUtc - clientsTimeInUtc;

            if (Math.abs(delta) > time.deltaDifferenceThreshold) {
                // client is differs too much
                res.status(403).send('' + currentTimeInUtc);
            } else {
                // client's time is close enough
                res.status(200).send('' + currentTimeInUtc);
            }
        }
    });

    app.get('/acceptinvitation', acceptGroupInvite);
    app.post('/acceptinvitation', acceptGroupInvite);

    function acceptGroupInvite(req, res, next) {
        var token;
        var username;
        var password;
        var loggedIn = isLoggedIn(req);
        var acceptOnThisAccount = false;
        var action = req.body.action;
        var signin = action == 'signin';
        var signup = action == 'signup';
        var getting = true;
        if (req.method == 'GET') {
            token = req.query.token;
        } else {
            getting = false;
            token = req.body.token;
            username = req.body.username;
            password = req.body.password;
            acceptOnThisAccount = action == 'this';
        }
        if(token) {
            return models.GroupInvitation.query(function acceptGroupInviteFindToken(q) {
                q.select()
                    .from('groupinvitations')
                    .where('groupinvitations.token', '=', token);
            })
                .fetch({
                    withRelated: [
                        'inviter',
                        'invited',
                        'group',
                        'groupinvitationuserclasses',
                        'groupinvitationuserclasses.groupuserclass'
                    ]
                })
                .tap(function acceptGroupInviteGotToken(groupinvitation) {
                    var data = {};
                    if (groupinvitation) {
                        var groupinvitationJson = groupinvitation.toJSON();
                        var now = time.nowInUtc();
                        data = {
                            invitation: groupinvitationJson,
                            inviter: groupinvitationJson.inviter,
                            invited: groupinvitationJson.invited,
                            group: groupinvitationJson.group,
                            userclasses: groupinvitationJson.groupinvitationuserclasses
                        };
                        if (now >= groupinvitationJson.expires) {
                            return res.render('layouts/groupinvite/expired', data);
                        }
                        if (loggedIn) {
                            return models.Users.query(function acceptGroupInviteGetLoggedInUser(q) {
                                q.select(models.usersColumns)
                                    .from('users')
                                    .where('users.id', '=', req.user.id);
                            })
                                .fetch({
                                    require: true
                                })
                                .tap(function acceptGroupInviteGotLoggedInUser(loggedIn) {
                                    data.loggedIn = loggedIn.toJSON();
                                    if (data.loggedIn instanceof Array && data.loggedIn.length > 0) {
                                        data.loggedIn = data.loggedIn[0]
                                    }
                                    return afterGettingLoggedInUsersStuff();
                                });
                        } else {
                            return afterGettingLoggedInUsersStuff();
                        }
                    } else {
                        renderPage('layouts/groupinvite/unknown');
                    }

                    function renderPage(path, message) {
                        // reject fields that we don't want to leak to a template
                        if (data.invited) {
                            var validKeys = _.reject(Object.keys(data.invited), function (columnName) {
                                return (users.bannedFields.indexOf(columnName) < 0);
                            });

                            data.invited = _.reduce(validKeys, function (memo, validColumn) {
                                memo[validColumn] = data.invited[validColumn];
                                return memo;
                            }, {});
                        }

                        data.message = message;

                        res.render(path, data);
                    }

                    function showPage(message) {
                        renderPage("layouts/groupinvite/accept", message);
                    }

                    function showPageErrorUserIsInviter() {
                        showPage("That user did the inviting");
                    }

                    function afterGettingLoggedInUsersStuff() {
                        if (getting) {
                            showPage();
                        } else {
                            if ((loggedIn && !signin) || signup) {
                                return afterLoggedInConsumeToken();
                            } else if (signin) {
                                return passport.authenticate('local', {session: true}, function (err, user, info) {
                                    if (err) {return next(err); }
                                    if (!user) {
                                        data.loginFailure = true;
                                        data.inputUsername = username;
                                        showPage();
                                    } else {
                                        if (user.id == data.inviter.id) {
                                            return showPageErrorUserIsInviter();
                                        }
                                        return req.login(user, function (err) {
                                            if (err) {
                                                return res.sendStatus(500);
                                            }

                                            data.invited = req.user;

                                            return models.issueToken(req.user, function (err, token, tokenid) {
                                                if (err) {
                                                    return res.redirect('/');
                                                }
                                                return models.registerDeviceIdForUser(req.user.id, req.body.deviceid, req.body.platform, getWhenRememberMeTokenExpires(), tokenid, function (deviceIdRegistered, err) {
                                                    if (err) {
                                                        console.log("Failed to register user's device for push notifications - userid: " + req.user.id + " deviceid:" + req.body.deviceid + "\n" + err);
                                                    }
                                                    res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: maxAgeInMs});

                                                    return afterLoggedInConsumeToken();
                                                });
                                            });
                                        });
                                    }
                                })(req, res, function() {
                                    return showPage();
                                });
                            }
                        }
                    }

                    function afterLoggedInConsumeToken() {
                        // fail if the logged in user is the one who did the inviting
                        if (!signup && req.user.id == data.inviter.id) {
                            return showPageErrorUserIsInviter();
                        }

                        if (signup) {
                            // signup
                            signup = false;
                            return users.createUser(undefined, req, function consumeInviteSignupUser(user) {
                                // need to sign in as user
                                return req.login(user, function (err) {
                                    if (err) {
                                        return res.sendStatus(500);
                                    }

                                    data.invited = req.user;

                                    return models.issueToken(req.user, function (err, token, tokenid) {
                                        if (err) {
                                            return res.redirect('/');
                                        }
                                        return models.registerDeviceIdForUser(req.user.id, req.body.deviceid, req.body.platform, getWhenRememberMeTokenExpires(), tokenid, function (deviceIdRegistered, err) {
                                            if (err) {
                                                console.log("Failed to register user's device for push notifications - userid: " + req.user.id + " deviceid:" + req.body.deviceid + "\n" + err);
                                            }
                                            res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: maxAgeInMs});

                                            return afterLoggedInConsumeToken();
                                        });
                                    });
                                });
                            });
                        }

                        return models.Bookshelf.transaction(function consumeInviteTokenTransaction(t) {
                            var sqlOptions = {
                                transacting: t
                            };

                            return consumeInviteTokenAddUserToGroup();

                            function consumeInviteTokenAddUserToGroup() {
                                // make the user a member of the group with the specified permission level
                                return models.UserGroup.forge({
                                    group_id: data.group.id,
                                    user_id: req.user.id,
                                    grouppermission_id: data.invitation.grouppermission_id
                                })
                                    .save(undefined, sqlOptions)
                                    .tap(function consumeInviteTokenCreateUserGroups() {
                                        var groupuserclass_ids = _.reduce(data.userclasses, function(memo, userclass) {
                                            memo.push(userclass.id);
                                            return memo;
                                        }, []);
                                        // figure out what job types they already have
                                        // then don't grant them a duplicate of any of them
                                        return models.GroupUserClassToUser.query(function consumeInviteTokenGetExistingUserclasses(q) {
                                            q.select('groupuserclasstousers.groupuserclass_id as groupuserclass_id')
                                                .from('groupuserclasstousers')
                                                .whereIn('groupuserclasstousers.groupuserclass_id', groupuserclass_ids);
                                        })
                                            .fetchAll(sqlOptions)
                                            .tap(function consumeInviteTokenGotExistingUserclasses(existingUserclasses) {
                                                var userclassesIdsMap = _.reduce(existingUserclasses.toJSON(), function(memo, userclass) {
                                                    memo['' + userclass.groupuserclass_id] = true;
                                                    return memo;
                                                }, {});

                                                var newGroupUserClassToUser = _.reduce(groupuserclass_ids, function(memo, groupuserclass_id) {
                                                    if (!userclassesIdsMap.hasOwnProperty('' + groupuserclass_id)) {
                                                        memo.push({
                                                            user_id: data.invited.id,
                                                            groupuserclass_id: groupuserclass_id
                                                        });
                                                    }
                                                    return memo;
                                                }, []);

                                                if (newGroupUserClassToUser.length > 0) {
                                                    // grant the user the specified job types
                                                    return models.GroupUserClassToUser.forge(newGroupUserClassToUser)
                                                        .save(undefined, sqlOptions)
                                                        .tap(consumeInviteTokenUsergroupsGranted);
                                                } else {
                                                    return consumeInviteTokenUsergroupsGranted();
                                                }

                                                function consumeInviteTokenUsergroupsGranted() {
                                                    // finally delete the invitation
                                                    return models.GroupInvitation.query(function consumeInviteTokenDeleteInvitation(q) {
                                                        q.select()
                                                            .from('groupinvitations')
                                                            .where('groupinvitations.id', '=', data.invitation.id)
                                                            .del();
                                                    })
                                                        .fetch(sqlOptions)
                                                        .tap(function consumeInviteTokenInvitationDeleted() {
                                                            // success!
                                                            // user has been added to the group
                                                            // and set to the specified job types
                                                            // and the invitation has been deleted
                                                            renderPage('layouts/groupinvite/success');
                                                        });
                                                }
                                            });
                                    });
                            }
                        })
                            .catch(function(err) {
                                showPage('messsage.internalerror');
                            });
                    }
                });
        } else {
            res.redirect('/');
        }
    }

    app.post('/accept', function acceptGroupInviteLogin(req, res, next) {

        if (!token) {
            res.redirect('/');
        }

        if (username && password) {

        } else if (loggedIn) {

        } else {
            res.redirect('/');
        }
    });

    // consumes email verification token
    app.get('/emailverify', function getEmailVerify(req, res, next) {
        if(req.query.hasOwnProperty('token')) {
            var token = req.query.token;
            return models.Bookshelf.transaction(function emailVerifyTransaction(t) {
                return users.consumeEmailVerifyToken(token, {
                    transacting: t
                }, function emailVerifyTransactionConsumed(user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                return res.sendStatus(500);
                            }

                            models.issueToken(req.user, function (err, token, tokenid) {
                                if (err) {
                                    return res.redirect('/');
                                }
                                models.registerDeviceIdForUser(req.user.id, req.body.deviceid, req.body.platform, getWhenRememberMeTokenExpires(), tokenid, function (deviceIdRegistered, err) {
                                    if (err) {
                                        console.log("Failed to register user's device for push notifications - userid: " + req.user.id + " deviceid:" + req.body.deviceid + "\n" + err);
                                    }
                                    res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: maxAgeInMs});

                                    res.redirect('/');
                                });
                            });
                        })
                    } else {
                        res.sendStatus(400);
                    }
                });
            })
                .catch(function (err) {
                    res.sendStatus(500);
                });
        } else {
            // token not passed in properly, redirect the user
            res.redirect('/');
        }
    });

    function getWhenRememberMeTokenExpires() {
        return time.nowInUtc() + (maxAgeInMs / 1000);
    }

    app.post('/session/login', requireJson, function(req, res, next) {
        passport.authenticate('local', {session: true}, function (err, user, info) {
            if (err) { return next(err); }
            console.log("login request:");
            console.log(req.body);
            // authentication failed, send 401 unauthorized
            if (!user) { return res.sendStatus(401); }
            if (req.body.deviceid && req.body.deviceid != '') {
                console.log("User sent a deviceid, attempting to send message after 10s");
                console.log("Sending device a push notification... " + req.body.deviceid);
                appLogic.fireEvent('loggedIn', user.id);
                /*
                setTimeout(function () {
                        console.log("Sending device a push notification... " + req.body.deviceid);
                        appLogic.fireEvent('loggedIn', user.id);
                    },
                    10 * 1000
                );
                */
            }
            req.login(user, function (err) {
                if (err) { return next(err); }

                var expires = getWhenRememberMeTokenExpires();
                // https://github.com/jaredhanson/passport-remember-me#setting-the-remember-me-cookie
                // issue a remember me cookie if the option was checked
                users.getUserInfo(req.user.id, function(err, userJson) {
                    if (err) {
                        // FIXME: This would still let user login temporary session
                        error(req, res, err);
                        next(err);
                    } else {
                        if (req.body.remember_me) {
                            models.issueToken(req.user, function (err, token, tokenid) {
                                if (err) {
                                    return next(err);
                                }
                                models.registerDeviceIdForUser(req.user.id, req.body.deviceid, req.body.platform, expires, tokenid, function (deviceIdRegistered, err) {
                                    if (err) {
                                        console.log("Failed to register user's device for push notifications - userid: " + req.user.id + " deviceid:" + req.body.deviceid + "\n" + err);
                                    }
                                    res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: maxAgeInMs});
                                    res.send({
                                        token: token,
                                        expires: expires,
                                        registeredForPush: deviceIdRegistered,
                                        userinfo: userJson
                                    });
                                    next();
                                });
                            });
                        } else {
                            models.isDeviceRegistered(req.body.deviceid, function(deviceIdRegistered) {
                                res.send({
                                    registeredForPush: deviceIdRegistered,
                                    userinfo: userJson
                                });
                                next();
                            });
                        }
                    }
                });
            });
        })(req, res, next);
    });

    app.post('/session/logout', ensureCsrf, ensureAuthenticated, function(req, res, next) {

        logout(req, res);
        // client session.postAuth method expects JSON, it will error if sent a blank response
        res.send({});
    });

    app.get('/session', ensureAuthenticated, function(req, res, next){

        var defaults = {
            id: 0,
            username: '',
            name: '',
            email: ''
        };
        // only send information in the above hash to client
        res.statusCode = 200;
        res.send(_.pick(req.user, _.keys(defaults)));
    });

    // creating users is ok to do without being logged in
    app.post('/api/users', notLoggedIn, users['/'].post.route);
    app.get('/passwordreset', users['/passwordreset'].get.route);
    app.post('/passwordreset', users['/passwordreset'].post.route);
    app.post('/api/users/passwordreset', users['/passwordreset'].post.route);

};
