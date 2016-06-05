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

var common = require('./controllerCommon');
var getMark = common.getMark;
var setMark = common.setMark;
var clearMarks = common.clearMarks;
var error = common.error;

function errorOccurred(req, act, err) {
    // TODO: Hook up to general logging facility
    error(req, null, err);
}

module.exports = {

    auth: {

        '403': function(req, act) {
            req.statusCode = 403;
            return true;
        },

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

        'sublocation is part of location': function(req, act) {
            // TODO: IMPLEMENT
            return true;
        },

        'user can create a shift in this location': function(req, act) {
            // TODO: IMPLEMENT
            return true;
        },

        'mark if user is a group owner or privileged location member for this shift':
            markIfGroupOwnerOrPrivilegedMemberForShift,

        'user owns shift': function(req, act) {
            return models.Shift.query(function(q) {
                q.select()
                    .from('shifts')
                    .where('shifts.id', '=', req.params.shift_id)
                    .where('shifts.user_id', '=', req.user.id);
            })
                .fetch()
                .then(function(shift) {
                    if (shift) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(function(err) {
                    return false;
                })
        },

        'managing shift': function(req, act) {
            // TODO: Refactor this method to return true/false and make new method that has original behavior
            return markIfGroupOwnerOrPrivilegedMemberForShift(req, act)
                .then(function(result) {
                    var resultKey = req.params.shift_id;
                    if (!resultKey) {
                        resultKey = req.params.shiftapplication_id;
                    }
                    var mark = getMark(req, 'privilegedshift', resultKey);
                    clearMarks(req);

                    if (mark) {
                        return true;
                    }
                    return false;
                })
                .catch(function(err) {
                    return false;
                });
        },

        'mark groupuserclass options for shift': function(req, act) {
            var shift_id = req.params.shift_id;

            if (shift_id === undefined) {
                throw new Error("Shift not passed into route");
            }

            return models.GroupUserClass.query(function(q) {
                q.select()
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
                .catch(function(err) {
                    errorOccurred(req, act, err);
                    return false;
                });
        },

        'user can apply for shift': function(req, act) {
            var shift_id = req.params.shift_id;

            if (shift_id === undefined) {
                throw new Error("Shift not passed into route");
            }

            // a user can apply for a shift if
            // they are a part of the group user class attached to a shift
            return models.GroupUserClass.query(function(q) {
                q.select()
                    .from('groupuserclasses')
                    .innerJoin('shifts', function() {
                        this.on('shifts.groupuserclass_id', '=', 'groupuserclasses.id');
                    })
                    .where('shifts.id', '=', shift_id)
                    .innerJoin('groupuserclasstousers', function() {
                        this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                    })
                    .where('groupuserclasstousers.user_id', '=', req.user.id);
            })
                .fetch({require: true})
                .then(function(groupuserclass) {
                    return true;
                })
                .catch(function(err) {
                    console.log(err);
                    return false;
                });
        },

        'mark if user is member of location': function markIfUserIsMemberOfLocation(req, act) {
            return models.UserPermission.query(function(q) {
                q.select()
                    .from('userpermissions')
                    .where('userpermissions.user_id', '=', req.user.id)
                    .andWhere('userpermissions.location_id', '=', req.params.location_id);
            })
                .fetch()
                .then(function markIfUserIsMemberOfLocationSuccess(userpermission) {
                    if (userpermission) {
                        setMark(req, 'location.member', true);
                        return true;
                    } else {
                        setMark(req, 'location.member', true);
                        return true;
                    }
                })
        }

    }

};

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
            .innerJoin('locations', function() {
                this.on('locations.id', '=', 'userpermissions.location_id');
            })
            .where('userpermissions.location_id', '=', location_id)
            .innerJoin('groups', function() {
                this.on('groups.id', '=', 'locations.group_id');
            })
            .innerJoin('groupuserclasses', function() {
                this.on('groupuserclasses.group_id', '=', 'groups.id');
            })
            .innerJoin('groupuserclasstousers', function() {
                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id')
                    .andOn('groupuserclasstousers.user_id', '=', req.user.id);
            })
            .innerJoin('grouppermissions', function() {
                this.on('groupuserclasses.grouppermission_id', '=', 'grouppermissions.id');
            })
            .where('grouppermissions.permissionlevel', '>=', permissionLevel);
    })
        .fetchAll()
        .then(function(locations) {
            if (locations.length > 0) {
                return true;
            } else {
                return false;
            }
        })
        .catch(function(err) {
            return false;
        });
}

function markIfGroupOwnerOrPrivilegedMemberForShift(req, act) {
    var shift_id = req.params.shift_id;
    var shiftapplication_id = req.params.shiftapplication_id;

    var submark = shift_id;
    if (!submark) {
        submark = shiftapplication_id;
    }

    if (shift_id === undefined && shiftapplication_id === undefined) {
        throw new Error("Shift is not passed into route");
    }

    var errorMessage = "Unknown error occurred";

    return models.Shift.query(function(q) {
        var ownedGroups =
            knex.select('groups.id as groupid')
                .from('groups')
                .where('groups.user_id', '=', req.user.id);

        var query = q.select('shifts.*')
            .from('shifts');

        if (shift_id) {
            query = query.where('shifts.id', '=', shift_id);
        } else if (shiftapplication_id) {
            query = query.innerJoin('shiftapplications', function() {
                this.on('shiftapplications.shift_id', '=', 'shifts.id')
            })
                .where('shiftapplications.id', '=', shiftapplication_id);
        } else {
            throw new Error(errorMessage);
        }

        query.leftJoin('sublocations', function() {
            this.on('sublocations.id', '=', 'shifts.sublocation_id');
        })
            .leftJoin('locations', function() {
                this.on('locations.id', '=', 'shifts.location_id')
                    .orOn('locations.id', '=', 'sublocations.location_id');
            })
            .whereIn('locations.group_id', ownedGroups);
    })
        .fetch({require: true})
        .then(function (group) {
            // FIXME: STUPID HACK TO SEND DATA TO GET /api/shifts/:shift_id
            setMark(req, 'privilegedshift', true, submark);
            return true;
        })
        .catch(function (err) {
            // TODO: Check if err is ModelNotFound error http://bookshelfjs.org/#section-Model-static-NotFoundError
            // not the group owner for this shift
            // fetch the shift and get the location id
            // then use that to re-use our privilege checking functions
            return models.Location.query(function(q) {
                var query = q.select('locations.id as locationid')
                    .from('shifts')
                    .leftJoin('sublocations', function() {
                        this.on('sublocations.id', '=', 'shifts.sublocation_id');
                    })
                    .innerJoin('locations', function() {
                        this.on('locations.id', '=', 'shifts.location_id')
                            .orOn('locations.id', '=', 'sublocations.location_id');
                    });
                if (shift_id) {
                    query = query.where('shifts.id', '=', shift_id);
                } else if (shiftapplication_id) {
                    query = query.innerJoin('shiftapplications', function() {
                        this.on('shiftapplications.shift_id', '=', 'shifts.id');
                    })
                        .where('shiftapplications.id', '=', shiftapplication_id);
                } else {
                    throw new Error(errorMessage);
                }
            })
                .fetch()
                .then(function(location) {
                    if (location) {
                        var location_id = location.get('locationid');

                        var old_location_id = req.params.location_id;
                        req.params.location_id = location_id;

                        return checkLocationPermissionLevel(privilegedLocationMember, req, act)
                            .then(function (result) {
                                if (result) {
                                    setMark(req, 'privilegedshift', true, submark);
                                }

                                req.params.location_id = old_location_id;
                                return true;
                            });
                    } else {
                        return true;
                    }
                })
                .catch(function(err) {
                    // no location tied to a shift...
                    errorOccurred(req, act, err);
                    return true;
                })
        });
}
