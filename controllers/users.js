var models = require('../app/models'),
    logout = require('../routes/misc/middleware').logout,
    updateModel = require('./controllerCommon').updateModel,
    _ = require('underscore'),
    config = require('config'),
    encryptKey = require('./encryption/encryption').encryptKey,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    getModelKeys = require('./controllerCommon').getModelKeys,
    clientCreate = require('./controllerCommon').clientCreate,
    clientError = require('./controllerCommon').clientError,
    getPatchKeysWithoutBannedKeys = require('./controllerCommon').getPatchKeysWithoutBannedKeys,
    createSelectQueryForAllColumns = require('./controllerCommon').createSelectQueryForAllColumns,
    error = require('./controllerCommon').error,
    controllerCommon = require('./controllerCommon'),
    time = require('../app/time'),
    utils = require('../app/utils'),
    appLogic = require('../app'),
    variables = require('./variables'),
    Bookshelf = models.Bookshelf;

var modifiableAccountFields = [
    'id',
    'username',
    'email',
    'password', // require special route
    'squestion',
    'sanswer'
];

var fieldsToNotSendToClient = [
    'usersetting_id',
    'username',
    'password',
    'squestion',
    'sanswer'
];

module.exports = {
    bannedFields: fieldsToNotSendToClient,
    consumeEmailVerifyToken: consumeEmailVerifyToken,
    createUser: createUser,
    sendEmailVerificationEmail: sendEmailVerificationEmail,
    route: '/api/users',
    '/': {
        'get': { // get info about your account
            // auth: // anyone logged in
            route: function(req, res) {
                simpleGetSingleModel(
                    'User',
                    {
                        id: req.user.id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create an account
            // auth: // anyone not logged in
            route: function(req, res) {
                Bookshelf.transaction(function usersPostTransaction(t) {
                    var sqlOptions = {
                        transacting: t
                    };
                    return createUser(sqlOptions, req, false, function usersPostUserCreated(user) {
                        clientCreate(req, res, 201, user.get('id'));
                    });
                })
                    .catch(function usersPostTransactionCatch(err) {
                        if (err.hasOwnProperty('errors')) {
                            clientError(req, res, 400, err.errors);
                        } else {
                            error(req, res, err);
                        }
                    })
            }
        },
        'patch': { // update your account
            auth: ['current user'], // current logged in user
            route: function(req, res) {
                patchModel(
                    'User',
                    {
                        id: req.user.id
                    },
                    req,
                    res,
                    'Account updated',
                    modifiableAccountFields
                );
            }
        },
        'delete': { // delete your account
            // auth: // logged in
            route: function(req, res) {
                // TODO: Verify that deleting account logs you out
                /*
                deleteModel(
                    'User',
                    {
                        id: req.params.id
                    },
                    req,
                    res,
                    'Account successfully deleted'
                );
                */
                if (req.body.password === undefined) {
                    res.status(400) // bad request
                        .json({error: true, data: {message: 'Password required'}});

                } else {
                    models.User.query(function (q) {
                        q.select()
                            .from('users')
                            .where({
                                id: req.user.id,
                                // require password to delete account
                                password: encryptKey(req.body.password)
                            });
                    })
                        .destroy()
                        .then(function () {
                            logout(req, res);
                            res.json({error: false, data: {message: 'User successfully deleted'}});
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                }
            }
        }
    },
    '/passwordreset': {
        'get': {
            // auth: ['anyone'],
            route: function getPasswordResetCaptcha(req, res) {
                var token = req.query.token;
                if(token) {
                    return models.ResetPasswordToken.query(function findPasswordResetToken(q) {
                        q.select()
                            .from('resetpasswordtokens')
                            .where('resetpasswordtokens.token', '=', token);
                    })
                        .fetch()
                        .tap(function foundPasswordResetToken(resetpasswordtoken) {
                            if (resetpasswordtoken) {
                                res.render('layouts/passwordreset/accept', {
                                    token: token
                                });
                            } else {
                                return res.render('layouts/passwordreset/unknown');
                            }
                        });
                } else {
                    res.redirect('/');
                }
            }
        },
        'post': {
            route: function postPasswordResetCaptcha(req, res) {
                var usernameOrEmail = req.body.username;
                var token = req.body.token;
                var newpassword = req.body.password;
                var verifypassword = req.body.verifypassword;
                console.log(req.body);
                var verify = false;
                if (usernameOrEmail) {
                    usernameOrEmail = usernameOrEmail.toLowerCase();
                } else if (token && newpassword && verifypassword) {
                    if (newpassword === verifypassword &&
                        newpassword != null &&
                        newpassword.trim() != '') {
                        // passwords seem ok
                        verify = true;
                    } else {
                        var message;
                        if (newpassword !== verifypassword) {
                            message = "message.password.notmatch";
                        } else {
                            message = "message.password.invalid";
                        }
                        // invalid password
                        return res.render('layouts/passwordreset/accept', {
                            token: token
                        });
                    }
                } else {
                    return res.sendStatus(400);
                }
                Bookshelf.transaction(function(t) {
                    var sqlOptions = {
                        transacting: t
                    };

                    if (verify) {
                        console.log("Verifying...");
                        return models.ResetPasswordToken.query(function findPasswordResetToken(q) {
                            q.select()
                                .from('resetpasswordtokens')
                                .where('resetpasswordtokens.token', '=', token);
                        })
                            .fetch(sqlOptions)
                            .tap(function foundPasswordResetToken(resetpasswordtoken) {
                                if (resetpasswordtoken) {
                                    // token is valid
                                    // set user's password to the newpassword
                                    return models.User.query(function resetUsersPasswordQuery(q) {
                                        q.select()
                                            .from('users')
                                            .where('users.id', '=', resetpasswordtoken.get('user_id'))
                                            .update({
                                                password: encryptKey(newpassword),
                                                // also verify email because they got this link from their email!
                                                verified_email: true
                                            });
                                    })
                                        .fetch(sqlOptions)
                                        .tap(function usersPasswordReset() {
                                            return models.ResetPasswordToken.query(function resetPasswordConsumeToken(q) {
                                                q.select()
                                                    .from('resetpasswordtokens')
                                                    .where('resetpasswordtokens.token', '=', token)
                                                    .del();
                                            })
                                                .fetch(sqlOptions)
                                                .tap(function usersPasswordResetComplete() {
                                                    res.render('layouts/passwordreset/success');
                                                });
                                        });
                                } else {
                                    return res.render('layouts/passwordreset/unknown');
                                }
                            });
                    } else {
                        // check if the username/email is valid
                        return models.User.query(function postPasswordResetFindUsernameOrEmail(q) {
                            q.select('users.id as id')
                                .from('users')
                                .where('users.username', '=', usernameOrEmail)
                                .orWhere('users.email', '=', usernameOrEmail);
                        })
                            .fetch(sqlOptions)
                            .tap(function postPasswordResetFoundUser(user) {
                                if (user) {
                                    return models.ResetPasswordToken.query(function (q) {
                                        q.select()
                                            .from('resetpasswordtokens')
                                            .where('resetpasswordtokens.user_id', '=', user.get('id'));
                                    })
                                        .fetch(sqlOptions)
                                        .tap(function postPasswordResetFindExistingTokens(token) {
                                            var now = time.nowInUtc();
                                            var generatedToken = null;
                                            if (token) {
                                                // token already exists
                                                // see if it has been a bit since we last sent an email
                                                // if it has been a little, re-send the same email
                                                if (token.get('expires') >= now) {
                                                    // token expired
                                                    // update it and resend the invite email
                                                    generatedToken = generatePasswordToken();
                                                    return models.ResetPasswordToken.query(function(q) {
                                                        q.select()
                                                            .from('resetpasswordtokens')
                                                            .where('id', '=', token.get('id'))
                                                            .update({
                                                                token: generatedToken,
                                                                expires: passwordTokenExpiresAt(now),
                                                                lastEmailSent: now
                                                            })
                                                    })
                                                        .fetchAll(sqlOptions)
                                                        .tap(passwordTokenCreated);
                                                } else {
                                                    // token is not expired
                                                    // check if it has been a little bit since it was last sent
                                                    var interval = getEmailResetInterval();
                                                    var canSendFrom = now + interval;
                                                    if (token.get('lastEmailSent') > canSendFrom) {
                                                        return models.ResetPasswordToken.query(function(q) {
                                                            q.select()
                                                                .from('resetpasswordtokens')
                                                                .update({
                                                                    lastEmailSent: now
                                                                });
                                                        })
                                                            .fetchAll(sqlOptions)
                                                            .tap(passwordTokenCreated);
                                                    } else {
                                                        // don't send
                                                        return res.sendStatus(200);
                                                    }
                                                }
                                            } else {
                                                // create a token and trigger email event
                                                generatedToken = generatePasswordToken();
                                                return models.ResetPasswordToken.forge({
                                                    user_id: user.get('id'),
                                                    token: generatedToken,
                                                    expires: passwordTokenExpiresAt(now),
                                                    lastEmailSent: now
                                                })
                                                    .save(undefined, sqlOptions)
                                                    .tap(passwordTokenCreated);
                                            }

                                            function generatePasswordToken() {
                                                return utils.randomString(64);
                                            }

                                            function passwordTokenExpiresAt(now) {
                                                return now + (60 * 60); // 1 hour
                                            }

                                            function passwordTokenCreated() {
                                                appLogic.fireEvent('passwordReset', user.get('id'), {
                                                    token: generatedToken
                                                });
                                                return res.sendStatus(200);
                                            }
                                        });
                                } else {
                                    // send success even if it failed (which it did)
                                    return res.sendStatus(200);
                                }
                            });
                    }
                });
            }
        }
    },
    '/emailverify': {
        'post': {
            // auth: ['anyone'], // anyone
            route: function(req, res) {
                Bookshelf.transaction(function emailVerifyPostTransaction(t) {
                    var sqlOptions = {
                        transacting: t
                    };
                    return models.Users.query(function emailVerifyPostTransactionQuery(q) {
                        q.select()
                            .from('users')
                            .where('users.id', '=', req.user.id)
                            .andWhere('users.verified_email', '=', true);
                    })
                        .fetch(sqlOptions)
                        .tap(function emailVerifyPostTransactionCheckUser(user) {
                            if (user) {
                                // user is already verified
                                res.sendStatus(200);
                            } else {
                                return purgeExpiredEmailVerificationTokens(sqlOptions)
                                    .tap(function emailVerifyPostTransactionExpiredTokensPurged() {
                                        // check if they already have an existing token
                                        return models.EmailVerifyToken.query(function purgeExpiredEmailVerificationTokensQuery(q) {
                                            q.select()
                                                .from('emailverifytokens')
                                                .where('user_id', '=', req.user.id);
                                        })
                                            .fetch(sqlOptions)
                                            .tap(function emailVerifyPostTransactionCheckLastEmail(existingToken) {
                                                if (existingToken) {
                                                    // they already have one
                                                    // check if it has been a little bit since the last one was sent
                                                    // to prevent against spam
                                                    var stagger = 60 * 5; // 5 mins
                                                    var now = time.nowInUtc();
                                                    var previousEmailSentAt = getWhenVerifyTokenWasSent(existingToken.get('expires'));
                                                    if (now - previousEmailSentAt >= stagger) {
                                                        // user has requested an email be sent to them already within the last 5 mins
                                                        // don't send another!
                                                        res.sendStatus(200);
                                                        return;
                                                    }
                                                }
                                                // it has been awhile since the user asked for a new email verification to be sent, send it to them!
                                                return models.EmailVerifyToken.query(function purgeExpiredEmailVerificationTokensQuery(q) {
                                                    q.select()
                                                        .from('emailverifytokens')
                                                        .where('user_id', '=', req.user.id)
                                                        .del();
                                                })
                                                    .fetchAll(sqlOptions)
                                                    .tap(function emailVerifyPostTransactionUsersTokensPurged() {
                                                        // their existing tokens should be purged now
                                                        // create a new one and email it to them
                                                        return sendEmailVerificationEmail(
                                                            user.toJSON(),
                                                            sqlOptions,
                                                            function emailVerifyPostTransactionSentEmail() {
                                                                return res.sendStatus(201);
                                                            }
                                                        );
                                                    });
                                            });
                                    });
                            }
                        });
                })
                    .catch(function emailVerifyPostTransactionCatch(err) {
                        error(req, res, err);
                    });
            }
        }
    },
    '/userinfo': {
        'get': { // gets related user info, including what locations/groups you manage or are a part of
            // auth: ['anyone'], // anyone
            route: function(req, res) {
                getUserInfo(req.user.id, function(err, userJson) {
                    if (err) {
                        error(req, res, err);
                    } else {
                        res.json(userJson);
                    }
                });
            }
        }
    },
    '/settings': {
        'get': {
            route: userSettingsGet
        },
        'post': {
            route: function userSettingsPost(req, res) {
                return models.User.forge({
                    id: req.user.id
                })
                    .fetch()
                    .tap(function(user) {
                        return models.UserSettings.query(function userSettingsPostQuery(q) {
                            q.select(
                                // do not send id to user
                                createSelectQueryForAllColumns('UserSetting', 'usersettings')
                            )
                                .from('usersettings')
                                .where('usersettings.id', '=', user.get('usersetting_id'))
                                .update(getPatchKeysWithoutBannedKeys(
                                    'UserSetting',
                                    req.body
                                ));
                        })
                            .fetch()
                            .then(function userSettingsPostThen(userSettings) {
                                return userSettingsGet(req, res);
                                //res.json(userSettings.toJSON());
                            })
                    })
                    .catch(function userSettingsPostError(err) {
                        error(req, res, err);
                    });
            }
        }
    },
    '/:user_id': {
        'get': { // get info about another account
            // auth: // your account or admin
            route: function(req, res) {
                var currentId = parseInt(req.user.id);
                var user_id = parseInt(req.params.user_id);

                if (user_id !== currentId) {
                    res.status(403).json({error: true, data: {}});
                }

                else {
                    models.User.forge({id: req.params.user_id})
                        .fetch()
                        .then(function (user) {
                            if (!user) {
                                res.status(404).json({error: true, data: {}});
                            }

                            else {
                                res.json(user.toJSON());
                            }
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                }
            }
        },
        'patch': { // update an account
            // auth: // your account or admin
            route: function(req, res) {
                console.log(models.User);
                var currentId = parseInt(req.user.id);
                var user_id = parseInt(req.params.user_id);

                if (user_id !== currentId) {
                    res.status(401).json({error: true, data: {}});
                }

                else {
                    patchModel(
                        'User',
                        {
                            id: req.user.id
                        },
                        req,
                        res,
                        'Account updated',
                        modifiableAccountFields
                    );
                }

            }
        },
        'delete': { // delete another account
            //auth: ['server admin'], // admin
            route: function(req, res) {
                var currentId = parseInt(req.user.id);
                var user_id = parseInt(req.params.user_id);

                if (user_id !== currentId) {
                    res.status(403).json({error: true, data: {}});
                }

                else {
                    models.User.query(function(q) {
                        q.select()
                            .from('users')
                            .where({
                                id: req.params.user_id
                            });
                    })
                        .destroy()
                        .then(function() {
                            res.json({error: false, data: {message: 'User successfully deleted'}});
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                }
            }
        }
    },
    getUserInfo: getUserInfo
};

function getUserInfo(user_id, next) {
    models.Group.query(function(q) {
        q.select()
            .from('groups')
            .where('groups.user_id', '=', user_id);
    })
        .fetchAll()
        .then(function(groupsYouOwn) {
            // now fetch groups you are a privileged member of
            return models.Group.query(function(q) {
                q.select()
                    .from('groups')
                    .innerJoin('usergroups', function() {
                        this.on('usergroups.group_id', '=', 'groups.id');
                    })
                    .where('usergroups.user_id', '=', user_id)
                    .innerJoin('grouppermissions', function() {
                        this.on('grouppermissions.id', '=', 'usergroups.grouppermission_id');
                    })
                    .where('grouppermissions.permissionlevel', '>=', variables.managingGroupMember);
            })
                .fetchAll({
                    withRelated: [
                        'grouppermissions',
                        'userClasses'
                    ]
                })
                .tap(function(groupsAPrivilegedMemberOf) {
                    return models.Location.query(function(q) {
                        q.select()
                            .from('locations')
                            .innerJoin('userpermissions', function() {
                                this.on('userpermissions.location_id', '=', 'locations.id');
                            })
                            .where('userpermissions.user_id', '=', user_id)
                            .innerJoin('groupuserclasses', function() {
                                this.on('groupuserclasses.group_id', '=', 'locations.group_id');
                            })
                            .innerJoin('groupuserclasstousers', function() {
                                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id')
                                    .andOn('groupuserclasstousers.user_id', '=', 'userpermissions.user_id');
                            })
                            .innerJoin('grouppermissions', function() {
                                this.on('grouppermissions.id', '=', 'groupuserclasses.grouppermission_id');
                            })
                            .where('grouppermissions.permissionlevel', '>=', variables.managingLocationMember);
                    })
                        .fetchAll({
                            withRelated: [
                                'sublocations',
                                'managingclassesatlocations',
                                'timezone'
                            ]
                        })
                        .tap(function(locationsAPrivilegedMemeberOf) {
                            return models.User.query(function(q) {
                                q.select(
                                    'users.id as id',
                                    'users.username as username',
                                    'users.firstname as firstname',
                                    'users.lastname as lastname'
                                    //'user.email as email', // should be hidden
                                )
                                    .from('users')
                                    .where('users.id', '=', user_id);
                            })
                                .fetch({
                                    require: true,
                                    withRelated: [
                                        'memberOfGroups.grouppermissions',
                                        'memberOfGroups.groupsetting',
                                        'memberOfGroups.userClasses',
                                        'userClasses',
                                        'usergroups'
                                        //'allGroupPermissions'
                                    ]
                                })
                                .tap(function(user) {
                                    return models.GroupPermission.query(function(q) {
                                        q.select()
                                            .from('grouppermissions')
                                            .innerJoin('groups', function() {
                                                this.on('groups.id', '=', 'grouppermissions.group_id');
                                            })
                                            .innerJoin('usergroups', function() {
                                                this.on('usergroups.group_id', '=', 'groups.id');
                                            })
                                            .where('usergroups.user_id', '=', user_id);
                                    })
                                        .fetchAll()
                                        .tap(function(allGroupPermissions) {
                                            var userJson = user.toJSON();
                                            if (allGroupPermissions) {
                                                userJson.allGroupPermissions = allGroupPermissions.toJSON();
                                            } else {
                                                userJson.allGroupPermissions = [];
                                            }
                                            if (groupsYouOwn) {
                                                userJson.ownedGroups = groupsYouOwn.toJSON();
                                            } else {
                                                userJson.ownedGroups = [];
                                            }
                                            if (groupsAPrivilegedMemberOf) {
                                                userJson.privilegedMemberOfGroups =
                                                    groupsAPrivilegedMemberOf.toJSON();
                                            } else {
                                                userJson.privilegedMemberOfGroups = [];
                                            }
                                            if (locationsAPrivilegedMemeberOf) {
                                                userJson.privilegedMemberOfLocations =
                                                    locationsAPrivilegedMemeberOf.toJSON();
                                            } else {
                                                userJson.privilegedMemberOfLocations = [];
                                            }
                                            var group_ids = [];
                                            _.each([
                                                userJson.ownedGroups,
                                                //userJson.memberOfGroups,
                                                userJson.privilegedMemberOfGroups
                                            ], function(groups) {
                                                _.each(groups, function(group) {
                                                    group_ids.push(group.id);
                                                });
                                            });

                                            // now fetch AreaLocation
                                            var location_ids = [];
                                            _.each([
                                                userJson.memberOfLocations,
                                                userJson.privilegedMemberOfLocations
                                            ], function(locations) {
                                                _.each(locations, function(location) {
                                                    location_ids.push(location.id);
                                                });
                                            });

                                            return models.Location.query(function(q) {
                                                q.select()
                                                    .from('locations')
                                                    .innerJoin('userpermissions', function() {
                                                        this.on('userpermissions.location_id', '=', 'locations.id');
                                                    })
                                                    .where('userpermissions.user_id', '=', user_id);
                                            })
                                                .fetchAll({
                                                    withRelated: [
                                                        'sublocations',
                                                        'managingclassesatlocations',
                                                        'timezone'
                                                    ]
                                                })
                                                .tap(function(locationsAndSublocations) {
                                                    if (locationsAndSublocations) {
                                                        userJson.memberOfLocations = locationsAndSublocations.toJSON();
                                                    }

                                                    return models.AreaLocation.query(function(q) {
                                                        q.select()
                                                            .from('arealocations')
                                                            .whereIn('arealocations.location_id', location_ids)
                                                    })
                                                        .fetchAll({
                                                            withRelated: [
                                                                'area'
                                                            ]
                                                        })
                                                        .tap(function(arealocations) {
                                                            if (arealocations) {
                                                                userJson.arealocations = arealocations.toJSON();
                                                            }

                                                            next(undefined, userJson);
                                                        });
                                                });
                                        });
                                });
                        });
                })
                .catch(function(err) {
                    next(err);
                });
        })
        .catch(function(err) {
            next(err);
        });
}

function userSettingsGet(req, res) {
    return models.UserSetting.query(function userSettinsGetQuery(q) {
        q.select(
            // do not send id to user
            createSelectQueryForAllColumns('UserSetting', 'usersettings', ['id'])
        )
            .from('usersettings')
            .innerJoin('users', function() {
                this.on('users.usersetting_id', '=', 'usersettings.id');
            })
            .where('users.id', '=', req.user.id);
    })
        .fetch()
        .then(function userSettingsGetThen(userSettings) {
            if (userSettings) {
                res.json(userSettings.toJSON());
            } else {
                console.log("WARNING: USER " + req.user.id + " has no usersettings_id field");
                res.status(204).json({});
            }
        })
        .catch(function userSettingsGetError(err) {
            error(req, res, err);
        });
}

function createEmailToken(user_id, sqlOptions, next) {
    var largeEnoughAttemptsToNotEverBeAnIssueButProtectAgainstInfiniteLoop = 100;
    return createEmailTokenRecurse(
        user_id,
        sqlOptions,
        next,
        largeEnoughAttemptsToNotEverBeAnIssueButProtectAgainstInfiniteLoop
    );
}

function createEmailTokenRecurse(user_id, sqlOptions, next, attemptsLeft) {
    if (attemptsLeft < 0) {
        return next(null);
    }
    var verifyToken = utils.randomString(64);
    return models.EmailVerifyToken.query(function emailVerifyTokenDuplicateCheckQuery(q) {
        q.select('emailverifytokens.user_id as user_id')
            .from('emailverifytokens')
            .where('emailverifytokens.token', '=', verifyToken);
    })
        .fetch(sqlOptions)
        .tap(function emailVerifyTokenDuplicateCheckResult(token) {
            if (token) {
                return createEmailTokenRecurse(user_id, sqlOptions, next, attemptsLeft - 1)
            } else {
                return models.EmailVerifyToken.forge({
                    user_id: user_id,
                    token: verifyToken,
                    expires: getWhenVerifyTokenShouldExpireFromNow()
                })
                    .save(undefined, sqlOptions)
                    .tap(function emailVerifyTokenCreated(tokenObject) {
                        return next(tokenObject.get('token'));
                    });
            }
        });
}

var emailVerifyTokenExpiresIn = (60 * 60 * 24 * 7 * 2) + (60 * 60 * 24); // 2 weeks + 1 day

function getWhenVerifyTokenShouldExpireFromNow() {
    return time.nowInUtc() + emailVerifyTokenExpiresIn;
}

function getWhenVerifyTokenWasSent(expires) {
    return expires - emailVerifyTokenExpiresIn;
}

function sendAccountActivatedEmail(user, next) {
    appLogic.accountActivated(user);
    return next();
}

function sendEmailVerificationEmail(userJson, sqlOptions, next) {
    var user_id = userJson.id;
    var email = userJson.email;
    var firstname = userJson.firstname;

    return createEmailToken(user_id, sqlOptions,
        function emailVerifyTokenCreated(token) {
            if (token == null) {
                // had a lot of collisions...
                // don't tell user, instead have them try to re-send their email verify key
                console.log("Got a null token when generating email verify token...");
            } else {
                console.log("Got a token to verify email with! " + token);
                appLogic.fireEvent('verifyEmail', user_id, {
                    token: token
                });
            }
            next();
        });
}

function purgeExpiredEmailVerificationTokens(sqlOptions) {
    return models.EmailVerifyToken.query(function purgeExpiredEmailVerificationTokensQuery(q) {
        q.select()
            .from('emailverifytokens')
            .where('expires', '<=', time.nowInUtc())
            .del();
    })
        .fetchAll(sqlOptions);
}

function consumeEmailVerifyToken(token, sqlOptions, next) {
    return models.EmailVerifyToken.query(function consumeEmailVerifyTokenQuery(q) {
        q.select()
            .from('emailverifytokens')
            .where('emailverifytokens.token', '=', token);
    })
        .fetch(sqlOptions)
        .tap(function consumeEmailVerifyTokenSuccess(foundToken) {
            if (foundToken) {
                var user_id = foundToken.get('user_id');
                return models.EmailVerifyToken.query(function consumeEmailVerifyTokenConsumeQuery(q) {
                    q.select()
                        .from('emailverifytokens')
                        .where('emailverifytokens.token', '=', token)
                        .del();
                })
                    .fetchAll(sqlOptions)
                    .tap(function consumeEmailVerifyTokenConsumedSuccess() {
                        return models.User.query(function consumeEmailVerifyTokenUpdateUserQuery(q) {
                            q.select()
                                .from('users')
                                .where('users.id', '=', user_id)
                                .update({
                                    verified_email: true
                                });
                        })
                            .fetch(sqlOptions)
                            .tap(function consumeEmailVerifyTokenUserUpdated() {
                                return models.User.query(function consumeEmailVerifyFetchUserInfo(q) {
                                    q.select()
                                        .from('users')
                                        .where('users.id', '=', user_id);
                                })
                                    .fetch(sqlOptions)
                                    .tap(function consumeEmailVerifyFetchUserInfoSuccess(user) {
                                        return sendAccountActivatedEmail(user_id, function accountActivatedEmailSent() {
                                            console.log(user_id);
                                            console.log(user);
                                            next(user);
                                        });
                                    });
                            });
                    });
            } else {
                // no token found
                console.log("no token found");
                next(null);
            }
        });
}

function createUser(sqlOptions, req, verified, next) {
    return models.UserSetting.forge({
        pushnotifications: true,
        emailnotifications: true,
        textnotifications: false
    })
        .save(null, sqlOptions)
        .tap(function usersPostUserSettingsSaved(usersettings) {
            var modelKeys = getModelKeys('User', ['id', 'usersetting_id']);
            var keysToSave = _.pick(req.body, _.keys(modelKeys));
            var fullArgs = _.extend(keysToSave, {
                usersetting_id: usersettings.get('id')
            });
            if (verified) {
                fullArgs.verified_email = true;
            }
            return models.User.forge(fullArgs)
                .save(undefined, sqlOptions)
                .tap(function(user) {
                    if (verified) {
                        return sendAccountActivatedEmail(
                            user.get('id'),
                            function accountActivatedEmailSent() {
                                return next(user);
                            }
                        );
                    } else {
                        return sendEmailVerificationEmail(
                            user.toJSON(),
                            sqlOptions,
                            function emailVerificationSent() {
                                return next(user);
                            });
                    }
                });
        });
}

function getEmailResetInterval() {
    var interval = 60 * 5;
    if (config.has('email.interval.reset')) {
        interval = config.get('email.interval.reset');
    }

    return interval;
}
