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
                                    res.json({error: false, data: {message: "Successfully deleted groups"}});
                                })
                                .catch(function(err) {
                                    res.json({error: true, data: {message: err}});
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
                    q.select('users.id', 'users.firstname', 'users.lastname', 'users.username')
                        .innerJoin('usergroups', function() {
                            this.on('users.id', '=', 'usergroups.user_id');
                    })
                        .where('usergroups.group_id', '=', req.params.group_id)
                        .union(function() {
                            this.select('users.id', 'users.firstname', 'users.lastname', 'users.username')
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
                    q.select('users.id', 'users.firstname', 'users.lastname', 'users.username')
                        .innerJoin('usergroups', function() {
                            this.on('users.id', '=', 'usergroups.user_id');
                        })
                        .where('users.id', '=', req.params.user_id)
                        .andWhere('usergroups.group_id', '=', req.params.group_id)
                        .union(function() {
                            this.select('users.id', 'users.firstname', 'users.lastname', 'users.username')
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
                            res.sendStatus(403);
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
                Bookshelf.transaction(function (t) {
                    // determine if the user is a part of the group already
                    return models.UserGroup
                        .where({
                            group_id: req.params.group_id,
                            user_id: req.params.user_id
                        })
                        .fetch(null, {transacting: t})
                        .then(function (usergroup) {
                            if (usergroup) {
                                // exists, delete it
                                usergroup.destroy()
                                    .then(function() {
                                        res.json({error: false, data: {message: "Successfully added user to group"}});
                                    })
                                    .catch(function(err) {
                                        res.status(500).json({error: true, data: {message: err}});
                                    });
                            } else {
                                res.status(403).json({error: false, data: {message: "User does not exist in group"}});
                            }
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                });
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
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged group member
        },
        'patch': { // update a users permission set
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged group member
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
            auth: ['group owner', 'or', 'privileged group member'] // group owner/privileged member
        }
    },
    '/:group_id/areas': {
        'get': { // get all areas attached
            auth: ['group owner', 'or', 'group member'] // owner/member
        },
        'post': { // create an area
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged member
        }
    },
    '/:group_id/areas/:area_id': {
        'delete': { // remove an area from this group
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged member
        }
    },
    '/:group_id/permissions': {
        'get': { // get all permission sets
            auth: ['group owner', 'or', 'group member'] // owner/member
        },
        'post': { // create a permission set
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged member
        }
    },
    '/:group_id/permissions/:permission_id': {
        'patch': { // update a group permission set
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged member
        },
        'delete': { // remove a permission set
            auth: ['group owner', 'or', 'privileged group member'] // owner/privileged member
        }
    }
}
;
