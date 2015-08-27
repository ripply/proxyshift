var models = require('../app/models');

module.exports = {

    auth: {

        'anyone': function(req, act) {
            return true
        },

        // optimized to make 1 query
        'group owner or group member': function(req, act) { // must be a group owner/member
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

        'group owner': function(req, act) {
            var group_id = req.params.group_id;
            var location_id = req.params.location_id;

            if (!req.user) {
                return false;
            }
            var user_id = req.user.id;

            if (group_id === undefined && location_id === undefined) {
                throw new Error("Group is not passed into route");
            }

            if (user_id === undefined) {
                throw new Error("User id not passed into route");
            }

            if (group_id !== undefined) {
                return models.Group.query(function (q) {
                    q.select('groups.*').innerJoin('usergroups', function () {
                        this.on('groups.id', '=', 'usergroups.group_id')
                            .andOn('groups.user_id', '=', user_id);
                    })
                        .where('groups.id', '=', group_id);
                })
                    .fetch({require: true})
                    .then(function (group) {
                        return true;
                    })
                    .catch(function (err) {
                        return false;
                    });
            } else if (location_id !== undefined) {
                return models.Group.query(function (q) {
                    q.select('groups.*').innerJoin('locations', function () {
                        this.on('groups.id', '=', 'locations.group_id')
                            .andOn('locations.id', '=', location_id);
                    })
                        .where('groups.user_id', '=', user_id);
                })
                    .fetch({require: true})
                    .then(function (group) {
                        return true;
                    })
                    .catch(function (err) {
                        return false;
                    });
            } else {
                throw new Error("Cannot determine if user " + user_id + " is a group owner");
            }
        },

        'group member': function(req, act) {
            var group_id = req.params.group_id;
            var location_id = req.params.location_id;

            if (!req.user) {
                return false;
            }
            var user_id = req.user.id;

            if (group_id === undefined && location_id === undefined) {
                throw new Error("Group is not passed into route");
            }

            if (user_id === undefined) {
                throw new Error("User id not passed into route");
            }

            if (group_id !== undefined) {
                return models.Group.query(function (q) {
                    q.select('groups.*')
                        .innerJoin('usergroups', function () {
                            this.on('groups.id', '=', 'usergroups.group_id')
                                .andOn('usergroups.user_id', '=', user_id);
                        })
                        .where('groups.id', '=', group_id)
                })
                    .fetch({require: true})
                    .then(function (group) {
                        return true;
                    })
                    .catch(function (err) {
                        return false;
                    });
            } else if (location_id !== undefined) {
                return models.UserGroups.query(function (q) {
                    q.select('usergroups.*')
                        .innerJoin('locations', function () {
                            this.on('usergroups.group_id', '=', 'locations.group_id');
                        })
                        .where('usergroups.group_id', '=', group_id)
                        .andWhere('locations.id', '=', location_id)
                        .andWhere('usergroups.user_id', '=', user_id);
                })
                    .fetch({require: true})
                    .then(function (group) {
                        return true;
                    })
                    .catch(function (err) {
                        return false;
                    });
            } else {
                throw new Error("Cannot determine if user " + user_id + " is a group member");
            }
        },

        'privileged group member': function(req, act) {
            return hasGroupPermissionLevel(1, req, act);
        },

        'very privileged group member': function(req, act) {
            return hasGroupPermissionLevel(2, req, act);
        },

        'location member': function(req, act) {
            return checkLocationPermissionLevel(0, req, act);
        },

        'privileged location member': function(req, act) {
            return checkLocationPermissionLevel(1, req, act);
        },

        'anyone can create shifts': function(req, act) {
            return false;
        },

        'server admin': function(req, act) {
            // TODO: IMPLEMENT
            return false;
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
        q.select('usergroups.*')
            .innerJoin('grouppermissions', function() {
                this.on('usergroups.grouppermission_id', '=', 'grouppermissions.id')
                    .andOn('usergroups.user_id', '=', user_id);
            })
            .where('permissionlevel', '>', permissionLevel)
            .union
    })
        .fetchAll({require: true})
        .then(function(grouppermissions) {
            return true;
        })
        .catch(function(err) {
            return false;
        });
}

function checkLocationPermissionLevel(permissionLevel, req, act) {
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
        q.select('userpermissions.*')
            .innerJoin('grouppermissions', function() {
                this.on('userpermissions.grouppermission_id', '=', 'grouppermissions.id')
                    .andOn('userpermissions.user_id', '=', user_id);
            })
            .where('permissionlevel', '>', permissionLevel)
            .andWhere('userpermissions.location_id', '=', location_id);
    })
        .fetchAll({require: true})
        .then(function(locations) {
            return true;
        })
        .catch(function(err) {
            return false;
        });
}
