var models = require('../app/models');
var knex = models.knex;
var variables = require('./variables.js');

var privilegedGroupMember = variables.privilegedGroupMember;
var managingGroupMember = variables.managingGroupMember;
var veryPrivilegedGroupMember = variables.veryPrivilegedGroupMember;

var privilegedLocationMember = variables.privilegedLocationMember;
var veryPrivilegedLocationMember = variables.veryPrivilegedLocationMember;
var managingLocationMember = variables.managingLocationMember;
var existsPermissionLevel = variables.existsPermissionLevel;

module.exports = {

    auth: {

        'anyone': function(req, act) {
            return true
        },

        'current user': function(req, act) {
            var current_user = req.user.id;
            var user_id = req.params.id;

            if( current_user === user_id ) {
                return true;
            }

            else {
                return false;
            }
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
                            this.on('usergroups.group_id', '=', 'locations.group_id')
                                .andOn('usergroups.user_id', '=', user_id);
                        })
                        .where('locations.id', '=', location_id);
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
            return hasGroupPermissionLevel(managingGroupMember, req, act);
        },

        'very privileged group member': function(req, act) {
            return hasGroupPermissionLevel(veryPrivilegedGroupMember, req, act);
        },

        'location member': function(req, act) {
            return checkLocationPermissionLevel(existsPermissionLevel, req, act);
        },

        'privileged location member': function(req, act) {
            return checkLocationPermissionLevel(privilegedLocationMember, req, act);
        },

        'anyone can create shifts': function(req, act) {
            return false;
        },

        'server admin': function(req, act) {
            // TODO: IMPLEMENT
            return false;
        },

        'mark if user is a group owner or privileged location member for this shift': function(req, act) {
            var shift_id = req.params.shift_id;

            if (shift_id === undefined) {
                throw new Error("Shift is not passed into route");
            }

            return models.Shift.query(function(q) {
                var ownedGroups =
                    knex.select('groups.* as tmp')
                        .from('groups')
                        .where('groups.user_id', '=', req.user.id);

                q.select('shifts.*')
                    .from('shifts')
                    .where('shifts.id', '=', shift_id)
                    .innerJoin('locations', function() {
                        this.on('locations.id', '=', 'shifts.location_id');
                    })
                    .whereIn('locations.group_id', ownedGroups)
                    .union(function() {
                        this.select('shifts.*')
                            .from('shifts')
                            .where('shifts_id', '=', shifts_id)
                            .innerJoin('sublocations', function() {
                                this.on('sublocations.id', '=', 'shifts.sublocation_id');
                            })
                            .innerJoin('locations', function() {
                                this.on('locations.id', '=', 'sublocations.location_id');
                            })
                            .whereIn('locations.group_id', ownedGroups);
                    });
            })
                .fetch({require: true})
                .then(function (group) {
                    // FIXME: STUPID HACK TO SEND DATA TO GET /api/shifts/:shift_id
                    if (req.user._privileged === undefined) {
                        req.user._privileged = {};
                    }
                    req.user._privileged[shift_id] = true;
                    return true;
                })
                .catch(function (err) {
                    // not the group owner for this shift
                    // fetch the shift and get the location id
                    // then use that to re-use our privilege checking functions
                    return models.Location.query(function(q) {
                        q.select('locations.id as locationid')
                            .from('locations')
                            .innerJoin('shifts', function() {
                                this.on('shifts.location_id', '=', 'locations.id');
                            })
                            .where('shifts.id', '=', shift_id)
                            .union(function() {
                                this.select('locations.id as locationid')
                                    .from('locations')
                                    .innerJoin('sublocations', function() {
                                        this.on('sublocations.location_id', '=', 'locations.id');
                                    })
                                    .innerJoin('shifts', function() {
                                        this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                    })
                                    .where('shifts.id', '=', shift_id);
                            });
                    })
                        .fetch({require: true})
                        .then(function(location) {
                            var location_id = location.get('locationid');

                            req.params.location_id = location_id;

                            return checkLocationPermissionLevel(privilegedLocationMember, req, act)
                                .then(function(result) {
                                    if (result) {
                                        if (req.user._privileged === undefined) {
                                            req.user._privileged = {};
                                        }
                                        req.user._privileged[shift_id] = true;
                                    }

                                    delete req.params.location_id;

                                    return true;
                                });
                        })
                        .catch(function(err) {
                            // no location tied to a shift...
                            console.log(err.message);
                            return true;
                        })
                });
        },

        'mark groupuserclass options for shift': function(req, act) {
            var shift_id = req.params.shift_id;

            if (shift_id === undefined) {
                throw new Error("Shift not passed into route");
            }

            return models.GroupUserClass.query(function(q) {
                q.select('groupuserclasses.* as tmp')
                    .from('groupuserclasses')
                    .innerJoin('shifts', function() {
                        this.on('shifts.groupuserclass_id', '=', 'groupuserclasses.id');
                    })
                    .where('shifts.id', '=', shift_id);
            })
                .fetch()
                .then(function(groupuserclass) {
                    if (!groupuserclass) {
                        setMark(req, 'shift.cansendnotification', groupuserclass.get('cansendnotification'), shift_id);
                        setMark(req, 'shift.requiremanagerapproval', groupuserclass.get('requiermanagerapproval'), shift_id);
                        return true;
                    } else {
                        // dont mark anything
                        return true;
                    }
                })
        }

    }

};

function setMark(req, mark, value, submark) {
    if (req.user.marks === undefined) {
        req.user.marks = {};
    }

    if (submark !== undefined) {
        if (req.user.marks[submark] === undefined) {
            req.user.marks[submark] = {};
        }

        if (typeof req.user.marks != 'object') {
            throw new Error("Cannot set mark value, unkown type: " + (typeof req.user.marks));
        }

        req.user.marks[mark][submark] = value;
    } else {
        req.user.marks[mark] = value;
    }
}

function getMark(req, mark, submark) {
    if (req.user.marks === undefined) {
        return undefined;
    }

    if (submark !== undefined) {
        return req.user.marks[mark];
    } else {
        return req.user.marks[mark][submark];
    }
}

function clearMarks(req) {
    if (req.user.marks !== undefined) {
        delete req.user.marks;
    }
}

function hasGroupPermissionLevel(permissionLevel, req, act) {
    // TODO: Combine group owner check
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
            .where('permissionlevel', '>=', permissionLevel);
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
    // TODO: Combine group owner check
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
            .where('permissionlevel', '>=', permissionLevel)
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
