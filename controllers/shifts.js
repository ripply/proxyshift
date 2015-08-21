var models = require('../app/models');
var knex = models.knex;
var moment = require('moment');

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
                            .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select()
                        .from('shifts')
                        .innerJoin('locations', function() {
                            this.on('shifts.location_id', '=', 'locations.id');
                        })
                        .where('shifts.start', '<=', before)
                        .orWhere('shifts.end', '>=', after)
                        .whereIn('locations.id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
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
                            .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select()
                        .from('shifts')
                        .innerJoin('locations', function() {
                            this.on('shifts.location_id', '=', 'locations.id');
                        })
                        //.where('shifts.start', '<=', before)
                        .orWhere('shifts.end', '>=', after)
                        .whereIn('locations.id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
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
    '/:location_id/managing': {
        'get': { // get shifts you are managing including last months
            // auth: // logged in
            route: function(req, res) {
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var after = now;
                var managingPermissionLevel = 2;
                models.Shift.query(function(q) {
                    // grab groups the user is a part of
                    var relatedGroupsSubQuery =
                        knex.select('usergroups.group_id as wat')
                            .from('usergroups')
                            .where('usergroups.user_id', '=', req.user.id)
                            .innerJoin('grouppermissions', function() {
                                this.on('usergroups.grouppermission_id', '=', 'grouppermissions.id')
                                    .andOn('grouppermissions.permissionlevel', '>', managingPermissionLevel);
                            })
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

                    var myUsergroupSubquery =
                        knex.select('usergroups.id as usergroupsid')
                            .from('usergroups')
                            .innerJoin('groups', function() {
                                this.on('groups.id', '=', 'usergroups.group_id')
                            })
                            .where('usergroups.user_id', '=', req.user.id)



                    // since this is for shifts you can manage
                    // we need to grab which userclasses
                    var managingUserClassesSubQuery =
                        knex.select('gropuuserclasses.id as groupuserclassid')
                            .from('groupuserclasses')
                            .innerJoin('groupuserclasstousers', function() {
                                this.on('groupusercasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                            })

                    var relatedUserClassesSubQuery =
                        knex.select('groupuserclasses.id as groupuserclassid')
                            .from('groupuserclasses')
                            .innerJoin('groupuserclasstousers', function() {
                                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                            })
                            .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select()
                        .from('shifts')
                        .innerJoin('locations', function() {
                            this.on('shifts.location_id', '=', 'locations.id');
                        })
                        //.where('shifts.start', '<=', before)
                        .orWhere('shifts.end', '>=', after)
                        .whereIn('locations.id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
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
            // auth: // connected to shift (part of location) or managing the shift
            route: function(req, res) {
                models.Shift.forge({id: req.params.shift_id})
                    .fetch()
                    .then(function (shift) {
                        if (!shift) {
                            res.status(404).json({error: true, data: {}});
                        }
                        else {
                            res.json(shift.toJSON());
                        }
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'patch': { // update a shift
            // auth: // must be managing the shift
            route: function(req, res) {
                console.log(req.body);
                models.Shift.forge({id: req.params.shift_id})
                    .fetch({require: true})
                    .then(function (shift) {
                        shift.save({
                            title: req.body.title|| shift.get('title'),
                            description: req.body.description|| shift.get('description'),
                            start: req.body.start|| shift.get('start'),
                            end: req.body.end|| shift.get('end')
                        })
                            .then(function () {
                                res.json({error: false, data: {message: 'Shift details updated'}});
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
        'delete': { // delete a shift
            // auth: // must be managing the shift
            route: function(req, res) {
                models.Shift.forge({id: req.params.shift_id})
                    .fetch({require: true})
                    .then(function (shift) {
                        shift.destroy()
                            .then(function () {
                                res.json({error: true, data: {message: 'Shift successfully deleted'}});
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

function grabNormalShiftRange(from, after, before) {
    if (from === undefined) {
        from = new Date();
    }
    if (after === undefined) {
        after = moment(from)
            .subtract('1', 'months')
            .endOf('month')
            .unix();
    }
    if (before === undefined) {
        before = moment(from)
            .add('3', 'months')
            .startOf('month')
            .unix();
    }

    return [after, before];
}
