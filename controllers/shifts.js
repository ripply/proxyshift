var models = require('../app/models');
var knex = models.knex;
var moment = require('moment');
var grabNormalShiftRange = require('./controllerCommon').grabNormalShiftRange;

var variables = require('./variables');

var getMark = require('./controllerCommon').getMark;
var clearMarks = require('./controllerCommon').clearMarks;

var postModel = require('./controllerCommon').postModel;
var patchModel = require('./controllerCommon').patchModel;
var deleteModel = require('./controllerCommon').deleteModel;

module.exports = {
    route: '/api/shifts',
    '/after/:after/before/:before': {
        'get': { // return all shifts you are connected to
            // auth: // logged in
            route: function(req, res) {
                // fetch the last month of shifts
                // the current month
                // and the next 2 months
                // if the user needs more in the calendar
                // the calendar will request specific ranges
                // TODO: Cache these dates until month ticks?
                var after = req.param("after");
                var before = req.param("before");
                console.log("before: " + before + ", after: " + after);
                var now = new Date();
                var range = grabNormalShiftRange(now, after, before);
                after = range[0];
                before = range[1];

                if (before > after) {
                    return res.status(400).json({error: true, data: {message: 'Invalid date range'}});
                }
                // TODO: THIS ROUTE HAS NO SECURITY AND NEEDS TESTS
                models.Shifts.forge()
                    .query(function(q) {
                        q.where('start', '<=', before)
                            .orWhere('end', '>=', after)
                    })
                    .fetch()
                    .then(function(collection) {
                        res.json(collection.toJSON());
                    })
                    .catch(function(err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
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
                        res.status(500).json({error: true, data: {message: err.message}});
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
                        res.status(500).json({error: true, data: {message: err.message}});
                    })
            }
        }
    },
    '/:shift_id': {
        'get': { // get info about a shift
            auth: ['mark if user is a group owner or privileged location member for this shift'], // connected to shift (part of location) or managing the shift
            route: function(req, res) {
                // determine if the user is allowed to access this
                var query = null;
                if (req.user._privileged !== undefined && req.user._privileged[req.params.shift_id]) {
                    // FIXME: There has to be a better way of passing variables through middleware
                    delete req.user._privileged[req.params.shift_id];
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
                        q.select('shifts.*')
                            .from('shifts')
                            .where('shifts.id', '=', req.params.shift_id)
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

                        q.select('shifts.*')
                            .from('shifts')
                            .where('shifts.id', '=', req.params.shift_id)
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
                                this.select('shifts.*')
                                    .from('shifts')
                                    .where('shifts.id', '=', req.params.shift_id)
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

                query
                    .fetch()
                    .then(function (shift) {
                        if (!shift) {
                            // check if the shift exists
                            // TODO: This should be inside a transaction
                            // but putting it inside one ends up deadlocking the server
                            // not high priority this only checks if the user
                            // does not have access to the shift after the fact.
                            // very very low priority
                            models.Shift.forge({
                                id: req.params.shift_id
                            })
                                .fetch({
                                    //transacting: t
                                })
                                .then(function (model) {
                                    if (model) {
                                        // shift exists
                                        // they dont have access to it though
                                        res.sendStatus(403);
                                    } else {
                                        // shift actually doesn't exist
                                        // just send 200 empty object
                                        res.json({});
                                    }
                                })
                                .catch(function (err) {
                                    res.status(500).json({error: true, data: {message: err.message}});
                                });
                        } else {
                            // determine if the user is a manager for this shift
                            // if they are not a manager
                            // we need to strip the 'shiftapplications'
                            // relation from the response
                            // non-managers should not be able to access that

                            res.json(shift.toJSON());
                        }
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
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
            }
        }
    },
    // created in context of /locations
    add: function(req, res) {
        if (req.body.start > req.body.end) {
            res.status(400).json({error: true, data: {message: 'Invalid date range'}})
        }
        models.Shift.forge({
            title: req.body.title,
            description: req.body.description,
            allday: req.body.allday,
            recurring: req.body.recurring,
            start: req.body.start,
            end: req.body.end
        })
            .save()
            .then(function (shift) {
                res.json({id: shift.get('id')});
                console.log('Shift added:');
                console.log(shift);
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
};

function notify(data) {

}
