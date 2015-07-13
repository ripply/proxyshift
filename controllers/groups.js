var models = require('../app/models'),
    Bookshelf = models.Bookshelf;

module.exports = {
    route: '/api/groups',
    '/': {
        'get': {
            // auth: // anyone can query what groups they are a part of/own
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
            // auth: // anyone can create a group
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
    '/:id': {
        'get': {
            auth: function (req, act) {
                // check if the user has access to this group
                // the user will be a part of the group
                // or own the group
                // select groups.* from groups inner join usergroups
                //   on groups.id = usergroups.group_id and usergroups.user_id = 3
                //   union select * from groups where user_id = 3;
                var group_id = req.params.id;
                var user_id = req.user.id;
                return models.Group.query(function (q) {
                    q.select('groups.*').innerJoin('usergroups', function () {
                        this.on('groups.id', '=', 'usergroups.group_id')
                            .andOn('usergroups.user_id', '=', user_id);
                    })
                        .where('groups.id', '=', group_id)
                        .union(function () {
                            this.select('groups.*')
                                .from('groups')
                                .where('user_id', '=', user_id)
                                .andWhere('id', '=', group_id);
                        });
                })
                    .fetch({require: true})
                    .then(function (group) {
                        return true;
                    })
                    .catch(function (err) {
                        return false;
                    });
            },
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
        'patch': {
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
    '/:id/classes': {
        'get': {
            // auth: // must be a member/owner of the group
        },
        'post': {
            // auth: // must be an owner or privileged group member
        }
    },
    '/:id/classes/:classid': {
        'get': {
            // auth: // must be a member/owner of the group
        },
        'patch': {
            // auth: // must be an owner or privileged group member
        }
    }
};
