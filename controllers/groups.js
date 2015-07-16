var models = require('../app/models'),
    Bookshelf = models.Bookshelf;

module.exports = {
    route: '/api/groups',
    '/': {
        'get': { // list all groups a part of
            auth: ['anyone'], // anyone can query what groups they are a part of/own
            route: function(req, res) {
                models.Group.forge({id: req.params.id})
                    .fetch()
                    .then(function (group) {
                        if (!group) {
                            res.status(404).json({error: true, data: {}});
                        }
                        else {
                            res.json(group.toJSON());
                        }
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
            auth: ['group owner', 'group member'],
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
                    .fetchAll()
                    .then(function (groups) {
                        res.json(groups.toJSON());
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'patch': { // update a group and group settings
            auth: ['group owner', 'privileged group member'], // must be owner or privileged member
            route: function(req, res) {
                console.log(req.body);
                models.Group.forge({id: req.params.id})
                    .fetch({require: true})
                    .then(function (group) {
                        group.save({
                            groupname: req.body.groupname|| group.get('groupname')
                        })
                            .then(function () {
                                res.json({error: false, data: {message: 'Group details updated'}});
                            })
                            .catch(function (err) {
                                res.status(500).json({error: true, data: {message: err.message}});
                            });
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'delete': {
            auth: ['group owner'], // must be group owner
            route: function(req, res) {
                models.Group.forge({id: req.params.id})
                    .fetch({require: true})
                    .then(function (group) {
                        group.destroy()
                            .then(function () {
                                res.json({error: true, data: {message: 'Group successfully deleted'}});
                            })
                            .catch(function (err) {
                                res.status(500).json({error: true, data: {message: err.message}});
                            });
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/group_id/classes': {
        'get': { // get list of all class types
            auth: ['group owner', 'group member'] // must be a member/owner of the group
        },
        'post': { // create new class for group
            auth: ['group owner', 'privileged group member'] // must be an owner or privileged group member
        }
    },
    '/group_id/classes/:classid': {
        'get': { // get info about a class type
            auth: ['group owner', 'group member'] // must be a member/owner of the group
        },
        'patch': { // update class type in group
            auth: ['group owner', 'privileged group member'] // must be an owner or privileged group member
        }
    },
    'group_id/users': {
        'get': { // get all group members
            auth: ['group owner', 'privileged group member'] // owner/privileged member
        }
    },
    'group_id/users/:user_id': {
        'get': { // get basic group member info
            auth: ['group owner', 'group member'] // must be owner owner of group or group member
        },
        'delete': { // remove user from group
            auth: ['group owner', 'privileged group member'] // privileged member or owner
        }
    },
    'group_id/users/:user_id/permissions': {
        'get': { // get a users group permissions
            auth: ['group owner', 'group member'] // owner/member
        }
    },
    'group_id/users/:user_id/permissions/:permission_id': {
        'post': { // add user with permission level to group
            auth: ['group owner', 'privileged group member'] // owner/privileged group member
        },
        'patch': { // update a users permission set
            auth: ['group owner', 'privileged group member'] // owner/privileged group member
        }
    },
    'group_id/locations': {
        'get': { // get list of all locations in group
            auth: ['group owner', 'group member'] // group member/owner
        },
        'post': { // create new location in group
            auth: ['group owner', 'privileged group member'] // group owner/privileged member
        }
    },
    'group_id/locations/:location_id': {
        'delete': { // remove location from group
            auth: ['group owner', 'privileged group member'] // group owner/privileged member
        }
    },
    'group_id/areas': {
        'get': { // get all areas attached
            auth: ['group owner', 'group member'] // owner/member
        },
        'post': { // create an area
            auth: ['group owner', 'privileged group member'] // owner/privileged member
        }
    },
    'group_id/areas/:area_id': {
        'delete': { // remove an area from this group
            auth: ['group owner', 'privileged group member'] // owner/privileged member
        }
    },
    'group_id/permissions': {
        'get': { // get all permission sets
            auth: ['group owner', 'group member'] // owner/member
        },
        'post': { // create a permission set
            auth: ['group owner', 'privileged group member'] // owner/privileged member
        }
    },
    'group_id/permissions/:permission_id': {
        'patch': { // update a group permission set
            auth: ['group owner', 'privileged group member'] // owner/privileged member
        },
        'delete': { // remove a permission set
            auth: ['group owner', 'privileged group member'] // owner/privileged member
        }
    }
}
;
