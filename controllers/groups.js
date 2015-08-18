var models = require('../app/models'),
    updateModel = require('./controllerCommon').updateModel,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    Bookshelf = models.Bookshelf;

module.exports = {
    route: '/api/groups',
    '/': {
        'get': { // list all groups a part of
            auth: ['anyone'], // anyone can query what groups they are a part of/own
            route: function(req, res) {
                models.Group.forge({id: req.params.id})
                    .fetchAll()
                    .then(function (groups) {
                        res.json(groups.toJSON());
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'post': {
            auth: ['anyone'], // anyone can create a group
            route: function (req, res) {
                Bookshelf.transaction(function (t) {
                    return models.GroupSetting.forge({})
                        .save(null, {transacting: t})
                        .tap(function (groupsetting) {
                            return models.Group.forge({
                                groupsetting_id: groupsetting.id,
                                user_id: req.user.id,
                                name: req.body.name,
                                state: req.body.state,
                                city: req.body.city,
                                address: req.body.address,
                                zipcode: req.body.zipcode,
                                weburl: req.body.weburl,
                                contactemail: req.body.contactemail,
                                contactphone: req.body.contactphone
                            })
                                .save(null, {transacting: t})
                                .tap(function (group) {
                                    return models.UserGroup.forge({
                                        user_id: req.user.id,
                                        group_id: group.id
                                    })
                                        .save(null, {transacting: t});
                                })
                        })
                })
                    .then(function (group) {
                        res.json({id: group.get('id')});
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/:group_id': {
        'get': {
            auth: ['group owner or group member'],
            route: function (req, res) {
                var user_id = req.user.id;
                models.Group.query(function (q) {
                    q.select('groups.*').innerJoin('usergroups', function () {
                        this.on('groups.id', '=', 'usergroups.group_id')
                            .andOn('usergroups.user_id', '=', user_id);
                    })
                        .union(function () {
                            this.select('*')
                                .from('groups')
                                .where('user_id', '=', user_id);
                        });
                })
                    .fetch()
                    .then(function (group) {
                        if (group) {
                            res.json(group.toJSON());
                        } else {
                            throw new Error("Error when fetching group id: " + req.params.group_id + " auth passed so group should exist");
                        }
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'patch': { // update a group and group settings
            auth: ['group owner', 'or', 'privileged group member'], // must be owner or privileged member
            route: function(req, res) {
                patchModel('Group',
                    {
                        id: req.params.group_id
                    },
                    req,
                    res,
                    'Group details updated'
                );
            }
        },
        'delete': {
            auth: ['group owner'], // must be group owner
            route: function(req, res) {
                // Start a transaction
                Bookshelf.transaction(function (t) {
                    // delete all locations that depend on this group
                    return models.Location
                        .where({
                            group_id: req.params.group_id
                        })
                        .destroy({transacting: t})
                        .then(function () {
                            // then delete the group
                            return models.Group.forge({
                                id: req.params.group_id
                            })
                                .destroy({transacting: t})
                                .then(function() {
                                    res.json({error: false, data: {message: "Successfully deleted group"}});
                                })
                                .catch(function(err) {
                                    res.status(500).json({error: true, data: {message: err}});
                                })
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                });
            }
        }
    },
    '/:group_id/classes': {
        'get': { // get list of all class types
            auth: ['group owner', 'or', 'group member'], // must be a member/owner of the group
            route: function(req, res) {
                simpleGetListModel('GroupUserClass',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create new class for group
            auth: ['group owner', 'or', 'privileged group member'], // must be an owner or privileged group member
            route: function(req, res) {
                postModel('GroupUserClass',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        }
    },
    '/:group_id/classes/:class_id': {
        'get': { // get info about a class type
            auth: ['group owner', 'or', 'group member'], // must be a member/owner of the group
            route: function(req, res) {
                simpleGetSingleModel('GroupUserClass',
                    {
                        id: req.params.class_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'patch': { // update class type in group
            auth: ['group owner', 'or', 'privileged group member'], // must be an owner or privileged group member
            route: function(req, res) {
                patchModel('GroupUserClass',
                    {
                        id: req.params.class_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    'User class details updated'
                );
            }
        },
        'delete': { // delete class type in group
            auth: ['group owner', 'or', 'very privileged group member'],
            route: function(req, res) {
                deleteModel('GroupUserClass',
                    {
                        id: req.params.class_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    'User class deleted'
                );
            }
        }
    },
    '/:group_id/users': {
        'get': { // get all group members
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                models.User.query(function(q) {
                    q.select('users.id as id', 'users.firstname as firstname', 'users.lastname as lastname', 'users.username as username')
                        .from('users')
                        .innerJoin('usergroups', function() {
                            this.on('users.id', '=', 'usergroups.user_id');
                    })
                        .where('usergroups.group_id', '=', req.params.group_id)
                        .union(function() {
                            this.select('users.id as id', 'users.firstname as firstname', 'users.lastname as lastname', 'users.username as username')
                                .from('users')
                                .innerJoin('groups', function() {
                                    this.on('users.id', '=', 'groups.user_id');
                                })
                                .where('groups.id', '=', req.params.group_id);
                        });
                })
                    .fetchAll()
                    .then(function(groupmembers) {
                        res.json(groupmembers.toJSON());
                    })
                    .catch(function(err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/:group_id/users/:user_id': {
        'get': { // get basic group member info
            auth: ['group owner', 'or', 'privileged group member'], // must be owner owner of group or group member
            route: function(req, res) {
                models.User.query(function(q) {
                    q.select('users.id as id', 'users.firstname as firstname', 'users.lastname as lastname', 'users.username as username')
                        .innerJoin('usergroups', function() {
                            this.on('users.id', '=', 'usergroups.user_id');
                        })
                        .where('users.id', '=', req.params.user_id)
                        .andWhere('usergroups.group_id', '=', req.params.group_id)
                        .union(function() {
                            this.select('users.id as id', 'users.firstname as firstname', 'users.lastname as lastname', 'users.username as username')
                                .from('users')
                                .innerJoin('groups', function() {
                                    this.on('users.id', '=', 'groups.user_id');
                                })
                                .where('groups.id', '=', req.params.group_id)
                                .andWhere('users.id', '=', req.params.user_id);
                        });
                })
                    .fetch()
                    .then(function(groupmembers) {
                        if (!groupmembers) {
                            res.status(403).json({error: true, data: {}});
                        } else {
                            res.json(groupmembers.toJSON());
                        }
                    })
                    .catch(function(err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'delete': { // remove user from group
            auth: ['group owner', 'or', 'privileged group member'], // privileged member or owner
            route: function(req, res) {
                deleteModel(
                    'UserGroup',
                    {
                        group_id: req.params.group_id,
                        user_id: req.params.user_id
                    },
                    req,
                    res,
                    'Successfully removed user from group'
                );
            }
        }
    },
    '/:group_id/users/:user_id/permissions': {
        'get': { // get a users group permissions
            auth: ['group owner', 'or', 'group member'] // owner/member
        }
    },
    '/:group_id/users/:user_id/permissions/:permission_id': {
        'post': { // add user with permission level to group
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged group member
            route: function(req, res) {
                Bookshelf.transaction(function (t) {
                    // make sure permission_id is part of group
                    model.GroupPermission.query(function (q) {
                        q.select()
                            .from('grouppermissions')
                            .innerJoin('groups', function () {
                                this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsettings_id');
                            })
                            .where('grouppermissions.id', '=', req.params.permission_id);
                    })
                        .fetch({transacting: t})
                        .then(function (grouppermission) {
                            if (grouppermission) {
                                // grouppermission is tied to group
                                // ok to add user with that permission
                                // after we verify that they are not already a member
                                model.UserGroup.forge({
                                    user_id: req.params.user_id,
                                    group_id: req.params.group_id
                                })
                                    .fetch({transacting: t})
                                    .then(function (usergroup) {
                                        if (!usergroup) {
                                            // does not exist, create
                                            postModel(
                                                'UserGroup',
                                                {
                                                    user_id: req.params.user_id,
                                                    group_id: req.params.group_id,
                                                    grouppermission_id: req.params.permission_id
                                                },
                                                req,
                                                res,
                                                undefined,
                                                {
                                                    transacting: t
                                                }
                                            );
                                        } else {
                                            // exists, dont add
                                            // check if permission level is identical
                                            if (usergroup.get('grouppermission_id') == req.params.permission_id) {
                                                res.sendStatus(200);
                                            } else {
                                                // doesn't match
                                                // send error
                                                res.sendStatus(412); // precondition failed
                                            }
                                        }
                                    })
                                    .catch(function (err) {
                                        res.status(500).json({error: true, data: {message: err.message}});
                                    });
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                });
            }
        },
        'patch': { // update a users permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged group member
            route: function(req, res) {
                Bookshelf.transaction(function (t) {
                    // make sure permission_id is part of group
                    model.GroupPermission.query(function (q) {
                        q.select()
                            .from('grouppermissions')
                            .innerJoin('groups', function () {
                                this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsettings_id');
                            })
                            .where('grouppermissions.id', '=', req.params.permission_id);
                    })
                        .fetch({transacting: t})
                        .then(function (grouppermission) {
                            if (grouppermission) {
                                // grouppermission is tied to group
                                // ok to update the user with that permission
                                // after we verify that they are not already a member
                                model.UserGroup.forge({
                                    user_id: req.params.user_id,
                                    group_id: req.params.group_id
                                })
                                    .fetch({transacting: t})
                                    .then(function (usergroup) {
                                        if (!usergroup) {
                                            // does not exist, error
                                            res.sendStatus(412);
                                        } else {
                                            // exists, update
                                            // check if permission level is identical
                                            if (usergroup.get('grouppermission_id') == req.params.permission_id) {
                                                res.sendStatus(200);
                                            } else {
                                                // doesn't match
                                                // update it
                                                patchModel(
                                                    'UserGroup',
                                                    {
                                                        grouppermission_id: req.params.permission_id
                                                    },
                                                    req,
                                                    res,
                                                    undefined,
                                                    {
                                                        transacting: t
                                                    }
                                                );
                                            }
                                        }
                                    })
                                    .catch(function (err) {
                                        res.status(500).json({error: true, data: {message: err.message}});
                                    });
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                });
            }
        }
    },
    '/:group_id/locations': {
        'get': { // get list of all locations in group
            auth: ['group owner or group member'], // group member/owner
            route: function(req, res) {
                simpleGetListModel(
                    'Location',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create new location in group
            auth: ['group owner', 'or', 'privileged group member'], // group owner/privileged member
            route: function(req, res) {
                postModel(
                    'Location',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                )
            }
        }
    },
    '/:group_id/locations/:location_id': {
        'delete': { // remove location from group
            auth: ['group owner', 'or', 'privileged group member'], // group owner/privileged member
            route: function(req, res) {
                simpleGetSingleModel(
                    'Location',
                    {
                        id: req.params.location_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        }
    },
    '/:group_id/areas': {
        'get': { // get all areas attached
            auth: ['group owner', 'or', 'group member'], // owner/member
            route: function(req, res) {
                simpleGetListModel(
                    'Area',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create an area
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                postModel(
                    'Area',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        }
    },
    '/:group_id/areas/:area_id': {
        'delete': { // remove an area from this group
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                models.Area
                    .where({
                        id: req.params.area_id,
                        group_id: req.params.group_id
                    })
                    .destroy()
                    .then(function() {
                        res.json({error: false, data: {message: "Successfully deleted Area"}});
                    })
                    .catch(function(err) {
                        res.status(500).json({error: true, data: {message: "Failed to delete Area"}});
                    });
            }
        }
    },
    '/:group_id/settings': {
        'get': { // get group settings
            auth: ['group owner or group member'],
            route: function(req, res) {
                models.GroupSetting.query(function(q) {
                    q.select()
                        .from('groups')
                        .innerJoin(function() {
                            this.on('groups.groupsetting_id', '=', 'groupsettings.id');
                        })
                        .where('groups.id', '=', req.params.group_id);
                })
                    .fetch()
                    .then(function (groupsetting) {
                        if (groupsetting) {
                            res.json(groupsetting);
                        } else {
                            throw new Error("Group setting should exist for group " + req.params.group_id);
                        }
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/:group_id/permissions': {
        'get': { // get all permission sets
            auth: ['group owner or group member'], // owner/member
            route: function(req, res) {
                // group -> groupsetting -> grouppermission
                Bookshelf.transaction(function (t) {
                    models.Group.forge({
                        id: req.params.group_id
                    })
                        .fetch({transacting: t})
                        .then(function(group) {
                            models.GroupPermission.forge({
                                groupsetting_id: group.get('groupsetting_id')
                            })
                                .fetchAll({transacting: t})
                                .then(function (grouppermissions) {
                                    // TODO: Return group settings id differently
                                    res.json(grouppermissions);
                                })
                                .catch(function (err) {
                                    res.status(500).json({error: true, data: {message: err.message}});
                                });

                        })
                        .catch(function(err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                });
            }
        },
        'post': { // create a permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                Bookshelf.transaction(function (t) {
                    models.GroupSetting.query(function(q) {
                        q.select()
                            .from('groups')
                            .innerJoin(function() {
                                this.on('groups.groupsetting_id', '=', 'groupsettings.id');
                            })
                            .where('groups.id', '=', req.params.group_id);
                    })
                        .fetch({transacting: t})
                        .then(function (groupsetting) {
                            if (groupsetting) {
                                postModel(
                                    'GroupPermission',
                                    {
                                        groupsetting_id: groupsetting.get('id')
                                    },
                                    req,
                                    res,
                                    undefined,
                                    {transacting: t}
                                );
                            } else {
                                throw new Error("Group setting should exist for group " + req.params.group_id);
                            }
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                });
            }
        }
    },
    '/:group_id/permissions/:permission_id': {
        'patch': { // update a group permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                // verify that permission is part of group
                Bookshelf.transaction(function(t) {
                    models.Group.query(function(q) {
                        q.select()
                            .from('groups')
                            .where('id', '=', req.params.group_id)
                    })
                        .fetch({transacting: t})
                        .then(function(group) {
                            if (group) {
                                var groupsetting_id = group.get('groupsetting_id');
                                patchModel(
                                    'GroupPermission',
                                    {
                                        id: req.params.permission_id,
                                        groupsetting_id: groupsetting_id
                                    },
                                    req,
                                    res,
                                    undefined,
                                    {
                                        transacting: t
                                    }
                                );
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function(err) {
                            // 500
                        });
                });
            }
        },
        'delete': { // remove a permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                // make sure permission is part of the group
                Bookshelf.transaction(function(t) {
                    models.Group.query(function(q) {
                        q.select()
                            .from('groups')
                            .where('id', '=', req.params.group_id);
                    })
                        .fetch({transacting: t})
                        .then(function(group) {
                            if (group) {
                                var groupsetting_id = group.get('groupsetting_id');
                                // this can 500 due to sql constraint failing if a user has this permission
                                deleteModel(
                                    'GroupPermission',
                                    {
                                        id: req.params.permission_id,
                                        groupsetting_id: groupsetting_id
                                    },
                                    req,
                                    res,
                                    'Successfully deleted group permission',
                                    {
                                        transacting: t
                                    }
                                );
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function(err) {
                            // 500
                        });
                });
            }
        }
    }/*,
    '/:group_id/permissions/:permission_id/newpermission/:newpermission_id': {
        'delete': { // remove a permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                // make sure permission is part of the group
                Bookshelf.transaction(function(t) {
                    models.Group.query(function(q) {
                        q.select()
                            .from('groups')
                            .where('id', '=', req.params.group_id);
                    })
                        .fetch({transacting: t})
                        .then(function(group) {
                            if (group) {
                                var grouppermission_id = group.get('grouppermission_id');
                                // verify that the new permission is part of the current group
                                deleteModel(
                                    'GroupPermission',
                                    {
                                        id: grouppermission_id,
                                    }
                                )
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function(err) {
                            // 500
                        });
                });
            }
        }
    }*/
}

;
