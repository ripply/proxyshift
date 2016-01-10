var models = require('../app/models'),
    logout = require('../routes/misc/middleware').logout,
    updateModel = require('./controllerCommon').updateModel,
    _ = require('underscore'),
    encryptKey = require('./encryption/encryption').encryptKey,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    getPatchKeysWithoutBannedKeys = require('./controllerCommon').getPatchKeysWithoutBannedKeys,
    createSelectQueryForAllColumns = require('./controllerCommon').createSelectQueryForAllColumns,
    error = require('./controllerCommon').error,
    controllerCommon = require('./controllerCommon'),
    variables = require('./variables'),
    Bookshelf = models.Bookshelf;

// NO-OPing, encrypti si done backend now
encryptKey = function(value) {
    return value;
};

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
                    return models.UserSetting.forge({})
                        .save(null, {transacting: t})
                        .tap(function usersPostUserSettingsSaved(usersettins) {
                            return postModel(
                                'User',
                                {
                                    usersetting_id: usersettins.get('id')
                                },
                                req,
                                res,
                                [
                                    'id',
                                    'usersetting_id'
                                ],
                                {
                                    transacting: t
                                }
                            );
                        });
                })
                    .catch(function usersPostTransactionCatch(err) {
                        error(req, res, err);
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
                return models.UserSettings.query(function userSettingsPostQuery(q) {
                    q.select(
                        // do not send id to user
                        createSelectQueryForAllColumns('UserSetting', 'usersettings')
                    )
                        .from('usersettings')
                        .innerJoin('users', function() {
                            this.on('users.usersetting_id', '=', 'usersettings.id')
                                .andOn('users.id', '=', req.user.id);
                        })
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
                    res.status(401).json({error: true, data: {}});
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
                    res.status(401).json({error: true, data: {}});
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
}

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
                .fetchAll()
                .then(function(groupsAPrivilegedMemberOf) {
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
                                'sublocations'
                            ]
                        })
                        .then(function(locationsAPrivilegedMemeberOf) {
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
                                        'memberOfGroups',
                                        'userClasses'
                                    ]
                                })
                                .then(function(user) {
                                    var userJson = user.toJSON();
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
                                                'sublocations'
                                            ]
                                        })
                                        .then(function(locationsAndSublocations) {
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
                                                .then(function(arealocations) {
                                                    if (arealocations) {
                                                        userJson.arealocations = arealocations.toJSON();
                                                    }

                                                    next(undefined, userJson);
                                                })
                                                .catch(function(err) {
                                                    next(err);
                                                });
                                        })
                                        .catch(function(err) {
                                            next(err);
                                        });
                                })
                                .catch(function(err) {
                                    next(err);
                                })
                        })
                        .catch(function(err) {
                            next(err);
                        })
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
