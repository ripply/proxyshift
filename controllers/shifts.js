var models = require('../app/models');
var Bookshelf = models.Bookshelf;
var knex = models.knex;
var moment = require('moment');
var controllerCommon = require('./controllerCommon');
var _ = require('underscore');
var grabNormalShiftRange = controllerCommon.grabNormalShiftRange;

var variables = require('./variables');


var getMark = controllerCommon.getMark;
var clearMarks = controllerCommon.clearMarks;
var postModel = controllerCommon.postModel;
var patchModel = controllerCommon.patchModel;
var deleteModel = controllerCommon.deleteModel;
var updateModel = controllerCommon.updateModel;
var error = controllerCommon.error;
var clientError = controllerCommon.clientError;
var getCurrentTimeForInsertionIntoDatabase = controllerCommon.getCurrentTimeForInsertionIntoDatabase;
var createSelectQueryForAllColumns = controllerCommon.createSelectQueryForAllColumns;

module.exports = {
    route: '/api/shifts',
    '/after/:after/before/:before': {
        'get': { // return all shifts you are connected to
            auth: ['mark if user is a group owner or privileged location member for this shift'],// logged in
            route: function(req, res) {
                getShifts(req, res);
            }
        }
    },
    '/all': {
        'get': { // get all shifts you can register for
            // auth: // logged in
            route: function(req, res) {
                var now = new Date();
                var range = grabNormalShiftRange(now, after, before);
                var after = range[0];
                var before = range[1];
                models.Shift.query(function(q) {
                    // grab groups the user is a part of
                    var relatedGroupsSubQuery =
                        knex.select('usergroups.group_id as wat')
                            .from('usergroups')
                            .where('usergroups.user_id', '=', req.user.id)
                            .union(function() {
                                this.select('groups.id as wat')
                                    .from('groups')
                                    .where('groups.user_id', '=', req.user.id);
                            });

                    // grab locations related to all of those groups
                    var relatedLocationsSubQuery =
                        knex.select('locations.id as locationid')
                            .from('locations')
                            .whereIn('locations.group_id', relatedGroupsSubQuery);

                    // grab all your user classes
                    var relatedUserClassesSubQuery =
                        knex.select('groupuserclasses.id as groupuserclassid')
                            .from('groupuserclasses')
                            .innerJoin('groupuserclasstousers', function() {
                                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                            })
                            .where('groupuserclasstousers.user_id', '=', req.user.id)
                            .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select('shifts.*')
                        .from('shifts')
                        .innerJoin('locations', function() {
                            this.on('shifts.location_id', '=', 'locations.id');
                        })
                        .where(function() {
                            this.where('shifts.start', '<=', before)
                                .orWhere('shifts.end', '>=', after);
                        })
                        .whereIn('locations.id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
                                .where(function() {
                                    this.where('shifts.start', '<=', before)
                                        .orWhere('shifts.end', '>=', after);
                                })
                                .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                                .whereIn('sublocations.location_id', relatedLocationsSubQuery);
                        });
                })
                    .fetchAll()
                    .then(function(shifts) {
                        if (shifts) {
                            // TODO: Fetch related group user class information
                            res.json(shifts.toJSON());
                        } else {
                            res.json([]);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    })
            }
        }
    },
    '/new': {
        'get': { // get new shifts that are not expired
            // auth: // logged in
            route: function(req, res) {
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var after = now;
                models.Shift.query(function(q) {
                    // grab groups the user is a part of
                    var relatedGroupsSubQuery =
                        knex.select('usergroups.group_id as wat')
                            .from('usergroups')
                            .where('usergroups.user_id', '=', req.user.id)
                            .union(function() {
                                this.select('groups.id as wat')
                                    .from('groups')
                                    .where('groups.user_id', '=', req.user.id);
                            });

                    // grab locations related to all of those groups
                    var relatedLocationsSubQuery =
                        knex.select('locations.id as locationid')
                            .from('locations')
                            .whereIn('locations.group_id', relatedGroupsSubQuery);

                    // grab all your user classes
                    var relatedUserClassesSubQuery =
                        knex.select('groupuserclasses.id as groupuserclassid')
                            .from('groupuserclasses')
                            .innerJoin('groupuserclasstousers', function() {
                                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                            })
                            .where('groupuserclasstousers.user_id', '=', req.user.id)
                            .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select('shifts.*')
                        .from('shifts')
                        .innerJoin('locations', function() {
                            this.on('shifts.location_id', '=', 'locations.id');
                        })
                        .where(function() {
                            this.where('shifts.end', '>=', after);
                        })
                        .whereIn('locations.id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
                                .where(function() {
                                    this.where('shifts.end', '>=', after);
                                })
                                .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                                .whereIn('sublocations.location_id', relatedLocationsSubQuery);
                        });
                })
                    .fetchAll()
                    .then(function(shifts) {
                        if (shifts) {
                            // TODO: Fetch related group user class information
                            res.json(shifts.toJSON());
                        } else {
                            res.json([]);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    })
            }
        }
    },
    '/managing': {
        'get': { // get all shifts you can manage that have not expired
            // auth: ['anyone']
            route: function(req, res) {
                getShiftsYouAreManaging(req, res);
            }
        }

    },
    '/:shift_id': {
        'get': { // get info about a shift
            auth: ['mark if user is a group owner or privileged location member for this shift'], // connected to shift (part of location) or managing the shift
            route: function(req, res) {
                getShifts(req, res);
            }
        },
        'patch': { // update a shift
            auth: ['managing shift'], // must be managing the shift
            route: function(req, res) {
                console.log(req.body);
                if (getMark(req, 'privilegedshift', req.param.shift_id)) {
                    patchModel(
                        'Shift',
                        {
                            id: req.params.shift_id
                        },
                        req,
                        res,
                        'Success',
                        [
                            'id'
                        ]
                    );
                } else {
                    req.sendStatus(401);
                }
            }
        },
        'delete': { // delete a shift
            auth: ['managing shift'],// must be managing the shift
            route: function(req, res) {
                if (getMark(req, 'privilegedshift', req.param.shift_id)) {
                    deleteModel(
                        'Shift',
                        {
                            id: req.params.shift_id
                        },
                        req,
                        res,
                        'Success'
                    );
                } else {
                    res.sendStatus(401);
                }
            }
        }
    },
    '/:shift_id/notify': {
        'post': { // sends out notification
            auth: ['mark groupuserclass options for shift'],
            route: function(req, res) {
                var canSendNotifications = getMark(req, 'shift.cansendnotification', req.params.shift_id);
                var requiremanagerapproval= getMark(req, 'shift.requiremanagerapproval', req.params.shift_id);

                clearMarks(req);
            }
        }
    },
    '/:shift_id/register': {
        'post': {
            auth: ['mark groupuserclass options for shift', 'user can apply for shift'],
            route: function(req, res) {
                // confirm that user can register for this shift
                // and shift has no user attached
                // if settings allow queueing for shifts and need manager approval
                // add to list
                // then send notification to managers
                // we should receive a notification when a manager approves
                var canSendNotifications = getMark(req, 'shift.cansendnotification', req.params.shift_id);
                var requiremanagerapproval= getMark(req, 'shift.requiremanagerapproval', req.params.shift_id);
                clearMarks(req);

                // the user should be able to apply for this shift
                // if the user requires manager approval:
                //  - it should not matter if the shift has already been applied for
                // if the user does not then
                //  - only one person can apply for the shift?
                //  - they can still apply to be next in line

                return Bookshelf.transaction(function(t) {
                    if (requiremanagerapproval) {
                        // apply for shift
                        return models.ShiftApplication.forge({
                            shift_id: req.params.shift_id,
                            user_id: req.user.id
                        })
                            .fetchAll(null, {
                                transacting: t
                            })
                            .tap(function (existingShiftApplications) {
                                if (existingShiftApplications) {
                                    // already exists
                                    // TODO: Maybe re-send notification to manager?
                                    req.sendStatus(200);
                                } else {
                                    // does not exist
                                    // create it!
                                    return models.ShiftApplication.forge({
                                        shift_id: req.params.shift_id,
                                        user_id: req.user.id,
                                        date: getCurrentTimeForInsertionIntoDatabase()
                                    })
                                        .save({
                                            transacting: t
                                        })
                                        .tap(function (model) {
                                            triggerShiftApplicationNotification(req.params.shift_id);
                                            res.sendStatus(201);
                                        });
                                }
                            })
                    } else {
                        // user does not need manager approval to apply for the shift
                        // check if someone has already applied for the shift
                        // if they have not, then we register for it
                        // otherwise we apply for queue
                        return models.Shift.forge({
                            id: req.params.shift_id
                        })
                            .fetch({
                                transacting: t,
                                // shift should exist
                                require: true
                            })
                            .tap(function(shift) {
                                var shift_user_id = shift.get('user_id');
                                if (shift_user_id) {
                                    // someone already has been approved for the shift
                                    // register in queue
                                    return models.ShiftApplication.forge({
                                        shift_id: req.params.shift_id,
                                        user_id: req.user.id,
                                        date: getCurrentTimeForInsertionIntoDatabase()
                                    })
                                        .save(null,
                                        {
                                            transacting: t
                                        })
                                        .tap(function (model) {
                                            triggerShiftApplicationNotification(req.params.shift_id);
                                            res.sendStatus(201);
                                        });
                                } else {
                                    // patch shift
                                    // TODO: Turn this into a patch
                                    return shift.save(
                                        updateModel(
                                            'Shift',
                                            shift, {
                                                user_id: req.user.id
                                            }
                                        ),
                                        {
                                            transacting: t
                                        }
                                    )
                                        .tap(function(model) {
                                            triggerShiftSuccessfullyAppliedNotification(req.params.shift_id);
                                            res.sendStatus(201);
                                        })
                                }
                            })
                    }
                })
                    .then(function(model) {
                        // do nothing, inner tap functions should handle this
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    });
            }
        }
    },
    '/:shift_id/ignore': {
        'post': {
            auth: ['user can apply for shift'],
            route: function(req, res) {
                var ignoreShiftData = {
                    shift_id: req.params.shift_id,
                    user_id: req.user.id
                };
                return Bookshelf.transaction(function(t) {
                    return models.IgnoreShift.forge(ignoreShiftData)
                        .fetch({
                            transacting: t
                        })
                        .then(function(ignoreShift) {
                            if (ignoreShift) {
                                // already ignored
                                res.send(200);
                            } else {
                                return models.IgnoreShift.forge(ignoreShiftData)
                                    .save(null, {
                                        transacting: t
                                    })
                                    .then(function(ignoredShift) {
                                        res.send(201)
                                    })
                                    .catch(function(err) {
                                        error(req, res, err);
                                    });

                            }
                        })
                        .catch(function(err) {
                            error(req, res, err);
                        });
                });
            }
        },
        'get': {
            route: function(req, res) {
                fetchIgnoredShifts(req, res);
            }
        }
    },
    '/:shift_id/unignore': {
        'post': {
            auth: ['user can apply for shift'],
            route: function(req, res) {
                var ignoreShiftData = {
                    shift_id: req.params.shift_id,
                    user_id: req.user.id
                };
                return Bookshelf.transaction(function(t) {
                    return models.IgnoreShift.forge(ignoreShiftData)
                        .fetchAll({
                            transacting: t
                        })
                        .then(function(ignoreShifts) {
                            if (ignoreShifts) {
                                // already ignored
                                ignoreShifts.destroy({
                                    transacting: t
                                })
                                    .then(function(destroyed) {
                                        res.send(200);
                                    })
                                    .catch(function(err) {
                                        error(req, res, err);
                                    });
                            } else {
                                res.send(200);
                            }
                        })
                        .catch(function(err) {
                            error(req, res, err);
                        });
                });
            }
        }
    },
    createNewShift: createNewShift,
    getShiftsYouAreManaging: getShiftsYouAreManaging

};

function fetchIgnoredShifts(req, res, from, to) {
    models.IgnoreShift.query(function(q) {
        var query = q.select()
            .from('ignoreshifts')
            .where('ignoreshifts.user_id', '=', req.user.id)
            .innerJoin('shifts', function() {
                this.on('shifts.id', '=', 'ignoreshifts.shift_id');
            });
        if (from) {
            query = query.where('ignoreshifts.date', '>=', from);
        }
        if (to) {
            query = query.where('ignoreshifts.date', '<=', to);
        }
    })
        .fetchAll()
        .then(function(ignoredShifts) {
            if (ignoredShifts) {
                res.json(ignoredShifts.toJSON());
            } else {
                res.json([]);
            }
        })
        .catch(function(err) {
            err(req, res, err);
        });
}

function triggerShiftApplicationNotification(shift_id) {
    // TODO: NO-OP for now
}

function triggerShiftSuccessfullyAppliedNotification(shift_id) {
    // TODO: NO-OP for now
}

function notify(data) {

}

/**
 * If a location is passed in
 * this method does not check if you are a privileged member of that location
 * @param req
 * @param res
 */
function getShiftsYouAreManaging(req, res) {
    // this should grab groups you are a member of
    // join them with the specific location
    // grab user classes you are managing
    // join them with shifts
    var now = new Date();
    var range = grabNormalShiftRange(now);
    var before = range[0];
    var after = new moment(now).unix();
    var managingPermissionLevel = 2;
    var location_id = req.params.location_id;
    models.Shift.query(function(q) {

        var managingClassesAtLocationSubQuery =
            knex.select('managingclassesatlocations.groupuserclass_id')
                .from('managingclassesatlocations')
                .innerJoin('usergroups', function() {
                    this.on('usergroups.id', '=', 'managingclassesatlocations.usergroup_id')
                        .andOn('usergroups.user_id', '=', req.user.id);
                });

        if (location_id !== undefined) {
            // if a specific location is needed
            var managingMemeberOfLocationSubQuery =
                knex.select('userpermissions.location_id as locationid')
                    .from('userpermissions')
                    .where('userpermissions.location_id', '=', location_id)
                    .innerJoin('grouppermissions', function () {
                        this.on('grouppermissions.id', '=', 'userpermissions.grouppermission_id');
                    })
                    .where('grouppermissions.permissionlevel', '>=', managingPermissionLevel);

            // fetch classes you are managing at the location
            managingClassesAtLocationSubQuery = managingClassesAtLocationSubQuery
                .whereIn('managingclassesatlocations.location_id', managingMemeberOfLocationSubQuery);
        }

        if (location_id) {
            // grab all shifts at locations/sublocations that are one of your job types
            q.select()
                .from('shifts')
                .where('shifts.location_id', '=', req.params.location_id)
                .andWhere(function () {
                    this.orWhere('shifts.start', '<=', before)
                        .orWhere('shifts.end', '>=', after);
                })
                .whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                .union(function () {
                    this.select('shifts.*')
                        .from('shifts')
                        .innerJoin('sublocations', function () {
                            this.on('shifts.sublocation_id', '=', 'sublocations.id');
                        })
                        .where('sublocations.location_id', '=', req.params.location_id)
                        //.whereIn('sublocations.location_id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                        .andWhere(function () {
                            this.orWhere('shifts.start', '<=', before)
                                .orWhere('shifts.end', '>=', after);
                        });
                });
        } else {
            // grab all shifts at locations/sublocations that you are a manager of and managing
            // TODO: SIMPLIFY THIS GOD AWFUL QUERY, BY USING ORs IT SHOULD BE ABLE TO BE SIMPLIFIED
            var columns = createSelectQueryForAllColumns('Shift', 'shifts');
            // get shifts by locations you are a manager of and managing class types
            q.select(columns)
                .from('shifts')
                .where(function () {
                    this.orWhere('shifts.start', '<=', before)
                        .orWhere('shifts.end', '>=', after);
                })
                //.whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                .innerJoin('locations', function() {
                    this.on('locations.id', '=', 'shifts.location_id');
                })
                .innerJoin('userpermissions', function() {
                    this.on('userpermissions.location_id', '=', 'locations.id')
                })
                .where('userpermissions.user_id', '=', req.user.id)
                .innerJoin('grouppermissions', function() {
                    this.on('grouppermissions.id', '=', 'userpermissions.grouppermission_id')
                })
                .where('grouppermissions.permissionlevel', '>=', managingPermissionLevel)
                .innerJoin('managingclassesatlocations', function() {
                    this.on('managingclassesatlocations.location_id', '=', 'locations.id');
                })
                .where('managingclassesatlocations.managing', '=', true)
                .innerJoin('usergroups', function() {
                    this.on('usergroups.id', '=', 'managingclassesatlocations.usergroup_id');
                })
                .where('usergroups.user_id', '=', req.user.id)
                .union(function() {
                    // get shifts by sublocations you are a manager of and managing class types
                    this.select(columns)
                        .from('shifts')
                        .where(function () {
                            this.orWhere('shifts.start', '<=', before)
                                .orWhere('shifts.end', '>=', after);
                        })
                        .innerJoin('sublocations', function() {
                            this.on('sublocations.id', '=', 'shifts.sublocation_id');
                        })
                        .innerJoin('locations', function() {
                            this.on('locations.id', '=', 'sublocations.location_id');
                        })
                        .innerJoin('userpermissions', function() {
                            this.on('userpermissions.location_id', '=', 'locations.id')
                        })
                        .where('userpermissions.user_id', '=', req.user.id)
                        .innerJoin('grouppermissions', function() {
                            this.on('grouppermissions.id', '=', 'userpermissions.grouppermission_id')
                        })
                        .where('grouppermissions.permissionlevel', '>=', managingPermissionLevel)
                        .innerJoin('managingclassesatlocations', function() {
                            this.on('managingclassesatlocations.location_id', '=', 'locations.id');
                        })
                        .where('managingclassesatlocations.managing', '=', true)
                        .innerJoin('usergroups', function() {
                            this.on('usergroups.id', '=', 'managingclassesatlocations.usergroup_id');
                        })
                        .where('usergroups.user_id', '=', req.user.id)
                        .union(function() {
                            // get shifts by groups => locations you are an owner of and managing class types
                            this.select(columns)
                                .from('shifts')
                                .where(function () {
                                    this.orWhere('shifts.start', '<=', before)
                                        .orWhere('shifts.end', '>=', after);
                                })
                                //.whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                                .innerJoin('locations', function() {
                                    this.on('locations.id', '=', 'shifts.location_id');
                                })
                                .innerJoin('groups', function() {
                                    this.on('groups.id', '=', 'locations.group_id');
                                })
                                // group owner can see all shifts in their group
                                .where('groups.user_id', '=', req.user.id)
                                .union(function() {
                                    // get shifts by groups => sublocations you are an owner of and managing class types
                                    this.select(columns)
                                        .from('shifts')
                                        .where(function () {
                                            this.orWhere('shifts.start', '<=', before)
                                                .orWhere('shifts.end', '>=', after);
                                        })
                                        //.whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                                        .innerJoin('sublocations', function() {
                                            this.on('sublocations.id', '=', 'shifts.sublocation_id');
                                        })
                                        .innerJoin('locations', function() {
                                            this.on('locations.id', '=', 'sublocations.location_id');
                                        })
                                        .innerJoin('groups', function() {
                                            this.on('groups.id', '=', 'locations.group_id');
                                        })
                                        .where('groups.user_id', '=', req.user.id);
                                });
                        });
                });
        }
    })
        .fetchAll({
            withRelated: 'shiftapplications'
        })
        .then(function(shifts) {
            if (shifts) {
                // TODO: Fetch related group user class information
                res.json(shifts.toJSON());
            } else {
                res.json([]);
            }
        })
        .catch(function(err) {
            error(req, res, err);
        })
}

function createNewShift(req, res) {
    // a shift needs a location or sublocation
    var location_id = req.params.location_id;
    var sublocation_id = req.params.sublocation_id;

    var otherArgs = {};
    if (sublocation_id) {
        otherArgs.sublocation_id = sublocation_id;
    } else if (location_id) {
        // TODO: Should we support user specifying both a location and a sublocation in a route?
        // the issues with that happen when a sublocation is moved from one location to another
        // currently, that functionality is not supported, but if it were to be this would cause issues
        // as a shift would be part of one location but part of another location's sublocation
        otherArgs.location_id = location_id;
    } else {
        throw new Error("When creating a shift, a location or sublocation is required");
    }

    otherArgs = _.extend(otherArgs, {
        start: req.params.start,
        end: req.params.end,
        groupuserclass_id: req.params.groupuserclass_id
    });

    if (req.body.start > req.body.end) {
        clientError(req, res, 400, 'Invalid date range');
    } else {
        postModel(
            'Shift',
            otherArgs,
            req,
            res,
            [
                'id',
                'user_id',
                'location_id',
                'sublocation_id',
                'groupuserclass_id',
                'notify'
            ]
        );
    }
}

/**
 * Should be called with
 * 'mark if user is a group owner or privileged location member for this shift'
 * @param req
 * @param res
 */
function getShifts(req, res) {
    // determine if the user is allowed to access this
    var privilegedshift = getMark(req, 'privilegedshift', req.params.shift_id);
    clearMarks(req);

    function applySearchConstraintsOnShiftsTable(query) {
        if (req.params.hasOwnProperty('shift_id')) {
            // getting specific shift
            return query.where('shifts.id', '=', req.params.shift_id);
        } else if (req.params.hasOwnProperty('before') &&
            req.params.hasOwnProperty('after')) {
            return query.where(function() {
                this.where('shifts.start', '<=', req.params.before)
                    .orWhere('end', '>=', req.params.after);
            });
        } else {
            throw new Error("No parameters passed in");
        }
    }

    Bookshelf.transaction(function(t) {

        var query = null;
        if (privilegedshift) {
            // privileged user
            // has to allow fetching of managing shifts
            query = models.Shift.query(function (q) {
                // there does not need to be any complex
                // security checking in this method
                // the auth method has already performed the following checks:
                // that the user is either a group owner tied to the location or sublocation of the shift
                // or that the user is a privileged location member tied to the location or sublocation
                // therefore, since privileged location members should be able to access any shift they want
                // and they specifically accessed this one
                // we will allow it since the prerequisites have already been checked
                var query = q.select('shifts.*')
                    .from('shifts');
                applySearchConstraintsOnShiftsTable(query)
                    .innerJoin('locations', function () {
                        this.on('shifts.location_id', '=', 'locations.id');
                    });
            })
        } else {
            // unprivileged user
            // only allows shifts they are elligible for
            query = models.Shift.query(function (q) {
                // grab groups the user is a part of
                var relatedGroupsSubQuery =
                    knex.select('usergroups.group_id as wat')
                        .from('usergroups')
                        .where('usergroups.user_id', '=', req.user.id)
                        .union(function () {
                            this.select('groups.id as wat')
                                .from('groups')
                                .where('groups.user_id', '=', req.user.id);
                        });

                // grab locations related to all of those groups
                var relatedLocationsSubQuery =
                    knex.select('locations.id as locationid')
                        .from('locations')
                        .whereIn('locations.group_id', relatedGroupsSubQuery);

                // grab all your user classes
                var relatedUserClassesSubQuery =
                    knex.select('groupuserclasses.id as groupuserclassid')
                        .from('groupuserclasses')
                        .innerJoin('groupuserclasstousers', function () {
                            this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                        })
                        .where('groupuserclasstousers.user_id', '=', req.user.id)
                        .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                // grab all shifts at locations/sublocations that are one of your job types

                var query = q.select('shifts.*')
                    .from('shifts');
                applySearchConstraintsOnShiftsTable(query)
                    //.where('shifts.id', '=', req.params.shift_id)
                    .innerJoin('locations', function () {
                        this.on('shifts.location_id', '=', 'locations.id');
                    })
                    /*.where(function() {
                     this.where('shifts.start', '<=', before)
                     .orWhere('shifts.end', '>=', after);
                     })*/
                    .whereIn('locations.id', relatedLocationsSubQuery)
                    .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                    .union(function () {
                        var query = this.select('shifts.*')
                            .from('shifts');
                        applySearchConstraintsOnShiftsTable(query)
                            //.where('shifts.id', '=', req.params.shift_id)
                            .innerJoin('sublocations', function () {
                                this.on('shifts.sublocation_id', '=', 'sublocations.id');
                            })
                            /*.where(function() {
                             this.where('shifts.start', '<=', before)
                             .orWhere('shifts.end', '>=', after);
                             })*/
                            .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                            .whereIn('sublocations.location_id', relatedLocationsSubQuery);
                    });
            })
        }

        var withRelatedOptions = {
            transacting: t
        };

        if (privilegedshift) {
            // people who have privileged access to shifts (group owners/managers)
            // will also be sent who has applied for the shift
            withRelatedOptions.withRelated = 'shiftapplications';
        }

        clearMarks(req);

        return query
            .fetch(withRelatedOptions)
            .tap(function (shift) {
                if (!shift) {
                    // check if the shift exists
                    // TODO: This should be inside a transaction
                    // but putting it inside one ends up deadlocking the server
                    // not high priority this only checks if the user
                    // does not have access to the shift after the fact.
                    // very very low priority
                    return models.Shift.forge({
                        id: req.params.shift_id
                    })
                        .fetch({
                            transacting: t
                        })
                        .tap(function (model) {
                            if (model) {
                                // shift exists
                                // they dont have access to it though
                                res.sendStatus(403);
                            } else {
                                // shift actually doesn't exist
                                // just send 200 empty object
                                res.sendStatus(204); // no content
                            }
                        })
                } else {
                    // determine if the user is a manager for this shift
                    // if they are not a manager
                    // we need to strip the 'shiftapplications'
                    // relation from the response
                    // non-managers should not be able to access that

                    res.json(shift.toJSON());
                }
            });
    })
        .then(function(model) {
            // do nothing, tap should take care of it
        })
        .catch(function (err) {
            error(req, res, err);
        });
}
