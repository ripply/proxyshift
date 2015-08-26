var models = require('../app/models'),
    updateModel = require('./controllerCommon').updateModel,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    getPatchKeysWithoutBannedKeys = require('./controllerCommon').getPatchKeysWithoutBannedKeys,
    Bookshelf = models.Bookshelf,
    grabNormalShiftRange = require('./controllerCommon').grabNormalShiftRange,
    knex = models.knex,
    moment = require('moment');

module.exports = {
    route: '/api/locations',
    '/': {
        'get': { // list all locations a part of
            //auth: ['anyone'], // anyone can query what locations they are a part of
            route: function (req, res) {
                return models.Location.query(function(q) {
                    var subquery =
                        knex.select('usergroups.group_id as wat')
                            .from('usergroups')
                            .where('usergroups.user_id', '=', req.user.id)
                            .union(function() {
                                this.select('groups.id as wat')
                                    .from('groups')
                                    .where('groups.user_id', '=', req.user.id);
                            });
                    q.select()
                        .from('locations')
                        .whereIn('group_id', subquery);
                })
                    .fetchAll()
                    .then(function(groupids) {
                        if (groupids) {
                            var ids = groupids.toJSON();
                            res.json(ids);
                        } else {
                            res.json([]);
                        }
                    })
                    .catch(function(err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/:location_id/shifts/managing': {
        'get': { // get shifts you are managing including last months
            auth: ['location member'],
            route: function(req, res) {
                // this should grab groups you are a member of
                // join them with the specific location
                // grab user classes you are managing
                // join them with shifts
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var before = range[0];
                var after = new moment(now).unix();
                var managingPermissionLevel = 2;
                models.Shift.query(function(q) {
                    /*
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

                    // make sure that the location is part of one of those groups
                    var relatedLocationsSubQuery =
                        knex.select('locations.id as locationid')
                            .from('locations')
                            .whereIn('locations.group_id', relatedGroupsSubQuery)
                            .andWhere('locations.id', '=', req.params.location_id);
                    */

                    var managingMemeberOfLocationSubQuery =
                        knex.select('userpermissions.location_id as locationid')
                            .from('userpermissions')
                            .where('userpermissions.location_id', '=', req.params.location_id)
                            .innerJoin('grouppermissions', function() {
                                this.on('grouppermissions.id', '=', 'userpermissions.grouppermission_id');
                            })
                            .where('grouppermissions.permissionlevel', '>=', managingPermissionLevel);

                    // fetch classes you are managing at the location
                    var managingClassesAtLocationSubQuery =
                        knex.select('managingclassesatlocations.groupuserclass_id')
                            .from('managingclassesatlocations')
                            .innerJoin('usergroups', function() {
                                this.on('usergroups.id', '=', 'managingclassesatlocations.usergroup_id')
                                    .andOn('usergroups.user_id', '=', req.user.id);
                            })
                            .whereIn('managingclassesatlocations.location_id', managingMemeberOfLocationSubQuery);
                            //.where('managingclassesatlocations.managing', '=', true)
                            //.where('managingclassesatlocations.location_id', '=', req.params.location_id);

                    // since this is for shifts you can manage
                    // we need to grab the userids of userclasses we manage
                    // this seems like it could be a big query returning thousands of ids
                    // TODO: Optimize this if it becomes a bottleneck
                    /*
                     var relatedUserClassesSubQuery =
                     knex.select('groupuserclasses.id as groupuserclassid')
                     .from('groupuserclasses')
                     .innerJoin('groupuserclasstousers', function() {
                     this.on('groupusercasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                     })
                     .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);
                     */
                    //

                    // grab all shifts at locations/sublocations that are one of your job types

                    console.log("before <= " + before);
                    console.log("end >= " + after);
                    q.select()
                        .from('shifts')
                        .where('shifts.location_id', '=', req.params.location_id)
                        .andWhere(function() {
                            this.orWhere('shifts.start', '<=', before)
                                .orWhere('shifts.end', '>=', after);
                        })
                        .whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
                                .where('sublocations.location_id', '=', req.params.location_id)
                                //.whereIn('sublocations.location_id', relatedLocationsSubQuery)
                                .whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                                .andWhere(function() {
                                    this.orWhere('shifts.start', '<=', before)
                                        .orWhere('shifts.end', '>=', after);
                                });
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
    '/:location_id/shifts': {
        'get': { // get all shifts you are eligible for in a location?
            auth: ['location member'], // must be a member/owner of the group
            route: function(req, res) {
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var before = range[0];
                var after = new moment(now).unix();
                getShiftsAtLocation(
                    req,
                    res,
                    before,
                    after
                );
            }
        }
    },
    '/:location_id/shifts/after/:after/before/:before': {
        'get': { // subroute of /:location_id/shifts with time constraints
            auth: ['location member'], // must be member of a location
            route: function(req, res) {
                getShiftsAtLocation(
                    req,
                    res,
                    req.params.before,
                    req.params.after
                );
            }
        }
    },
    '/:location_id/shifts/:groupuserclass_id': {
        'get': { // get shifts in a location that are of a certain class you are managing
            // filtering of /:location_id/shifts/managing
            // TODO: if privileged allow any groupuserclass
            // TODO: else, only allow ones you are a member of
            auth: ['location member'],
            route: function(req, res) {
                // this should grab groups you are a member of
                // join them with the specific location
                // grab user classes you are managing
                // join them with shifts
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var before = range[0];
                var after = new moment(now).unix();
                var managingPermissionLevel = 2;
                models.Shift.query(function(q) {
                    var managingMemeberOfLocationSubQuery =
                        knex.select('userpermissions.location_id as locationid')
                            .from('userpermissions')
                            .where('userpermissions.location_id', '=', req.params.location_id)
                            .innerJoin('grouppermissions', function() {
                                this.on('grouppermissions.id', '=', 'userpermissions.grouppermission_id');
                            })
                            .where('grouppermissions.permissionlevel', '>=', managingPermissionLevel);

                    // fetch classes you are managing at the location
                    var managingClassesAtLocationSubQuery =
                        knex.select('managingclassesatlocations.groupuserclass_id')
                            .from('managingclassesatlocations')
                            .innerJoin('usergroups', function() {
                                this.on('usergroups.id', '=', 'managingclassesatlocations.usergroup_id')
                                    .andOn('usergroups.user_id', '=', req.user.id);
                            })
                            .where('managingclassesatlocations.groupuserclass_id', '=', req.params.groupuserclass_id)
                            .whereIn('managingclassesatlocations.location_id', managingMemeberOfLocationSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select()
                        .from('shifts')
                        .where('shifts.location_id', '=', req.params.location_id)
                        .andWhere(function() {
                            this.orWhere('shifts.start', '<=', before)
                                .orWhere('shifts.end', '>=', after);
                        })
                        .whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
                                .where('sublocations.location_id', '=', req.params.location_id)
                                //.whereIn('sublocations.location_id', relatedLocationsSubQuery)
                                .whereIn('shifts.groupuserclass_id', managingClassesAtLocationSubQuery)
                                .andWhere(function() {
                                    this.orWhere('shifts.start', '<=', before)
                                        .orWhere('shifts.end', '>=', after);
                                });
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
    '/:location_id/sublocations': {
        'get': { // get all sublocations
            auth: ['location member'], // must be attached to the location
            route: function(req, res) {
                simpleGetListModel(
                    'SubLocation',
                    {
                        location_id: req.params.location_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create a sublocation
            auth: ['privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {
                postModel(
                    'SubLocation',
                    {
                        location_id: req.params.location_id
                    },
                    req,
                    res,
                    [
                        'id'
                    ]
                );
            }
        }
    },
    '/:location_id/sublocations/:sublocation_id': {
        'patch': { // update a sublocation
            auth: ['privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {
                models.SubLocation.query(function(q) {
                    q.select()
                        .from('sublocations')
                        .where('sublocations.id', '=', req.params.sublocation_id)
                        .innerJoin('locations', function() {
                            this.on('locations.id', '=', 'sublocations.location_id')
                        })
                        .where('locations.id', '=', req.params.location_id)
                        .patch(
                        getPatchKeysWithoutBannedKeys(req.body)
                    );
                })
                    .then(function (model) {
                        if (model) {
                            res.json({error: false, data: {message: 'Success'}});
                        } else {
                            res.status(403);
                        }
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'delete': { // delete a sublocation
            auth: ['privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {
                Bookshelf.transaction(function(t) {
                    // update all shifts with that sublocation to point to location
                    models.SubLocation.forge()
                        .where({
                            id: req.params.sublocation_id
                        })
                        .fetch({
                            transacting: t
                        })
                        .then(function(sublocation) {
                            if (sublocation) {
                                models.Shifts.query(function(q) {
                                    q.select()
                                        .from('shifts')
                                        .where('shifts.sublocation_id', '=', req.params.sublocation_id);
                                })
                                    .save({
                                        location_id: sublocation.get('location_id'),
                                        sublocation_id: null
                                    }, {
                                        patch: true,
                                        transacting: t
                                    })
                                    .then(function(model) {
                                        sublocation.destroy({transacting: t})
                                            .then(function(model) {
                                                res.json({error: false, data: {message: 'Success'}});
                                            })
                                            .catch(function(err) {
                                                t.rollback();
                                                res.status(500).json({error: true, data: {message: err.message}});
                                            });
                                    })
                                    .catch(function(err) {
                                        t.rollback();
                                        res.status(500).json({error: true, data: {message: err.message}});
                                    });
                            } else {
                                req.sendStatus(403);
                            }
                        })
                        .catch(function(err) {
                            t.rollback();
                            res.status(500).json({error: true, data: {message: err.message}});
                        })
                    })
            }
        }
    }
};

function getShiftsAtLocation(req, res, before, after) {
    var thisGroupIdSubQuery =
        knex.select('groups.id as groupid')
            .from('groups')
            .innerJoin('locations', function() {
                this.on('locations.group_id', '=', 'groups.id')
            })
            .where('locations.id', '=', req.params.location_id);

    var usersClassesAtLocationSubQuery =
        knex.select('groupuserclasstouser.groupuserclass_id as groupuserclassid')
            .from('groupuserclasstousers')
            .innerJoin('usergroups', function() {
                this.on('usergroups.id', '=', 'groupuserclasstousers.user_id')
            })
            .where('groupuserclasstousers.user_id', '=', req.user.id)
            .whereIn('usergroups.group_id', thisGroupIdSubQuery);

    // this should grab groups you are a member of
    // join them with the specific location
    // grab user classes you are managing
    // join them with shifts
    var managingPermissionLevel = 2;
    models.Shift.query(function(q) {
        // grab all shifts at locations/sublocations that are one of your job types

        q.select()
            .from('shifts')
            .where('shifts.location_id', '=', req.params.location_id)
            .andWhere(function() {
                this.orWhere('shifts.start', '<=', before)
                    .orWhere('shifts.end', '>=', after);
            })
            .whereIn('shifts.groupuserclass_id', usersClassesAtLocationSubQuery)
            .union(function() {
                this.select('shifts.*')
                    .from('shifts')
                    .innerJoin('sublocations', function() {
                        this.on('shifts.sublocation_id', '=', 'sublocations.id');
                    })
                    .where('sublocations.location_id', '=', req.params.location_id)
                    .whereIn('shifts.groupuserclass_id', usersClassesAtLocationSubQuery)
                    .andWhere(function() {
                        this.orWhere('shifts.start', '<=', before)
                            .orWhere('shifts.end', '>=', after);
                    });
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
