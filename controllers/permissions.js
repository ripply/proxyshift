var models = require('../app/models');

module.exports = {

    auth: {

        'anyone': function(req, act) {
            return true
        },

        // optimized to make 1 query
        'group member or group owner': function(req, act) { // must be a group owner/member
            // check if the user has access to this group
            // the user will be a part of the group
            // or own the group
            // select groups.* from groups inner join usergroups
            //   on groups.id = usergroups.group_id and usergroups.user_id = 3
            //   union select * from groups where user_id = 3;
            var group_id = req.params.group_id;
            if (!req.user) {
                return false;
            }
            var user_id = req.user.id;

            if (group_id === undefined) {
                throw new Error("Group is not passed into route");
            }

            if (user_id === undefined) {
                throw new Error("User id not passed into route");
            }

            return models.Group.query(function(q) {
                q.select('groups.*').innerJoin('usergroups', function() {
                    this.on('groups.id', '=', 'usergroups.group_id')
                        .andOn('usergroups.user_id', '=', user_id);
                })
                    .where('groups.id', '=', group_id)
                    .union(function() {
                        this.select('groups.*')
                            .from('groups')
                            .where('user_id', '=', user_id)
                            .andWhere('id', '=', group_id);
                    });
            })
                .fetch({require: true})
                .then(function(group) {
                    return true;
                })
                .catch(function(err) {
                    return false;
                });
        },

        'group owner': function(req, act) { // must be a group owner
            var group_id = req.params.group_id;
            if (!req.user) {
                return false;
            }
            var user_id = req.user.id;

            if (group_id === undefined) {
                throw new Error("Group is not passed into route");
            }

            if (user_id === undefined) {
                throw new Error("User id not passed into route");
            }

            return models.Group.forge({id: group_id,
                user_id: user_id})
                .fetch({require: true})
                .then(function(group) {
                    return true;
                })
                .catch(function(err) {
                    return false;
                });
        },

        'group member': function(req, act) { // must be a group member
            var group_id = req.params.group_id;
            if (!req.user) {
                return false;
            }
            var user_id = req.user.id;

            if (group_id === undefined) {
                throw new Error("Group is not passed into route");
            }

            if (user_id === undefined) {
                throw new Error("User id not passed into route");
            }

            return models.Group.query(function(q) {
                q.select('groups.*').innerJoin('usergroups', function() {
                    this.on('groups.id', '=', 'usergroups.group_id')
                        .andOn('usergroups.user_id', '=', user_id);
                })
                    .where('groups.id', '=', group_id);
            })
                .fetch({require: true})
                .then(function(group) {
                    return true;
                })
                .catch(function(err) {
                    return false;
                });
        },

        'privileged group member': function(req, act) {
            return hasGroupPermissionLevel(1, req, act);
        },

        'very privileged group member': function(req, act) {
            return hasGroupPermissionLevel(2, req, act);
        },

        'privileged location member': function(req, act) {
            var location_id = req.params.location_id;
            if (!req.user) {
                return false;
            }
            var user_id = req.user.id;

            if (location_id === undefined) {
                throw new Error("Location is not passed into route");
            }

            if (user_id === undefined) {
                throw new Error("User id not passed into route");
            }

            return models.UserPermission.query(function(q) {
                q.select('usergroups.*').innerJoin('grouppermissions', function() {
                    this.on('usergroups.grouppermission_id', '=', 'grouppermissions.id')
                        .andOn('usergroups.user_id', '=', user_id);
                })
                    .where('usergroups.group_id', '=', group_id);
            })
                .fetchAll({require: true})
                .then(function(grouppermissions) {
                    var priviledgedGroupPermission = grouppermissions.find(function(grouppermission) {
                        return grouppermission.get('permissionlevel') > 1;
                    });

                    return (!priviledgedGroupPermission);
                })
                .catch(function(err) {
                    return false;
                });
        }

    }

};

function hasGroupPermissionLevel(permissionLevel, req, act) {
    var group_id = req.params.group_id;
    if (!req.user) {
        return false;
    }
    var user_id = req.user.id;

    if (group_id === undefined) {
        throw new Error("Group is not passed into route");
    }

    if (user_id === undefined) {
        throw new Error("User id not passed into route");
    }

    return models.UserGroup.query(function(q) {
        q.select('usergroups.*').innerJoin('grouppermissions', function() {
            this.on('usergroups.grouppermission_id', '=', 'grouppermissions.id')
                .andOn('usergroups.user_id', '=', user_id);
        })
            .where('permissionlevel', '>', permissionLevel);
    })
        .fetchAll({require: true})
        .then(function(grouppermissions) {
            return true;
        })
        .catch(function(err) {
            return false;
        });
}
