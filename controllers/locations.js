var models = require('../app/models'),
    updateModel = require('./controllerCommon').updateModel,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    getMark = require('./controllerCommon').getMark,
    error = require('./controllerCommon').error,
    getPatchKeysWithoutBannedKeys = require('./controllerCommon').getPatchKeysWithoutBannedKeys,
    Bookshelf = models.Bookshelf,
    controllerCommon = require('./controllerCommon'),
    grabNormalShiftRange = require('./controllerCommon').grabNormalShiftRange,
    knex = models.knex,
    moment = require('moment'),
    variables = require('./variables'),
    _ = require('underscore');

var managingPermissionLevel = variables.managingPermissionLevel;
var getShiftsYouAreManaging = require('./shifts').getShiftsYouAreManaging;
var createNewShift = require('./shifts').createNewShift;

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
                        error(req, res, err);
                    });
            }
        }
    },
    '/:location_id/subscribe': {
        'post': {
            auth: ['mark if user is member of location'],
            route: function locationsSubscribePost(req, res) {
                return locationSubscribeUpdate(req, res, true);
            }
        },
        'delete': {
            auth: ['location member'],
            route: function locationsSubscribeDelete(req, res) {
                return locationSubscribeUpdate(req, res, false);
            }
        }
    },
    '/:location_id/shifts/managing': {
        'get': { // get shifts you are managing including last months
            auth: ['location member'],
            route: function(req, res) {
                getShiftsYouAreManaging(req, res);
            }
        }
    },
    '/:location_id/shifts': {
        'get': { // get all shifts you are eligible for in a location?
            auth: ['group owner', 'or', 'location member'], // must be a member/owner of the group
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
            auth: ['group owner', 'or', 'location member'], // must be member of a location
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
    '/:location_id/shifts/groupuserclass/:groupuserclass_id/start/:start/end/:end': {
        'post': {
            auth: ['user can create a shift in this location'],
            route: function(req, res) {
                createNewShift(req, res);
            }
        }
    },
    '/:location_id/shifts/:groupuserclass_id': {
        'get': { // get shifts in a location that are of a certain class you are managing
            // filtering of /:location_id/shifts/managing
            // TODO: if privileged allow any groupuserclass
            // TODO: else, only allow ones you are a member of
            auth: ['group owner', 'or', 'location member'],
            route: function(req, res) {
                // this should grab groups you are a member of
                // join them with the specific location
                // grab user classes you are managing
                // join them with shifts
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var before = range[0];
                var after = new moment(now).unix();
                models.Shift.query(function(q) {
                    var managingMemeberOfLocationSubQuery =
                        knex.select('userpermissions.location_id as locationid')
                            .from('userpermissions')
                            .where('userpermissions.location_id', '=', req.params.location_id)
                            .andWhere('userpermissions.subscribed', '=', controllerCommon.true)
                            .innerJoin('grouppermissions', function() {
                                this.on('grouppermissions.id', '=', 'userpermissionss.grouppermission_id');
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
                        error(req, res, err);
                    })
            }
        }
    },
    '/:location_id/sublocations': {
        'get': { // get all sublocations
            auth: ['group owner', 'or', 'location member'], // must be attached to the location
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
            // TODO: Add rule here to allow configurable permission of privileged location members being able to do this
            auth: ['group owner', 'or', 'privileged location member'], // must be a group owner or privileged group member attached to location
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
    '/:location_id/sublocations/:sublocation_id/shifts/groupuserclass/:groupuserclass_id/start/:start/end/:end': {
        'post': {
            auth: ['sublocation is part of location', 'and', 'user can create a shift in this location'],// sublocation is part of location
            route: function(req, res) {
                createNewShift(req, res);
            }
        }
    },
    '/:location_id/sublocations/:sublocation_id': {
        'get': { // fetch a sublocation
            auth: ['group owner', 'or', 'location member'],
            route: function(req, res) {
                simpleGetSingleModel(
                    'SubLocation',
                    {
                        id: req.params.sublocation_id,
                        location_id: req.params.location_id
                    },
                    req,
                    res
                );
            }
        },
        'patch': { // update a sublocation
            auth: ['group owner', 'or', 'privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {
                models.SubLocation.query(function(q) {
                    q.select()
                        .from('sublocations')
                        .where('sublocations.id', '=', req.params.sublocation_id)
                        .innerJoin('locations', function() {
                            this.on('locations.id', '=', 'sublocations.location_id')
                        })
                        .where('locations.id', '=', req.params.location_id);
                })
                    .save(
                    _.extend({
                            location_id: req.params.location_id
                        },
                        getPatchKeysWithoutBannedKeys(
                            'SubLocation',
                            req.body,
                            [
                                'location_id'
                            ]
                        )
                    ),
                    {patch: true}
                )
                    .then(function (model) {
                        if (model) {
                            //console.log(model.toJSON());
                            res.json({error: false, data: {message: 'Success'}});
                        } else {
                            res.status(403);
                        }
                    })
                    .catch(function (err) {
                        error(req, res, err);
                    });
            }
        },
        'delete': { // delete a sublocation
            auth: ['group owner', 'or', 'privileged location member'], // must be a group owner or privileged group member attached to location
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
                                                error(req, res, err);
                                            });
                                    })
                                    .catch(function(err) {
                                        t.rollback();
                                        error(req, res, err);
                                    });
                            } else {
                                req.sendStatus(403);
                            }
                        })
                        .catch(function(err) {
                            t.rollback();
                            error(req, res, err);
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
        knex.select('groupuserclasstousers.groupuserclass_id as groupuserclassid')
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
            error(req, res, err);
        })
}

function locationSubscribeUpdate(req, res, subscribed) {
    return Bookshelf.transaction(function(t) {
        return models.UserPermission.query(function(q) {
            q.select()
                .from('userpermissions')
                .where('userpermissions.user_id', '=', req.user.id)
                .andWhere('userpermissions.location_id', '=', req.params.location_id);
        })
            .fetch({
                transacting: t
            })
            .tap(function locationSubscribeUpdateCheck(userpermission) {
                if (userpermission) {
                    return models.UserPermission.query(function (q) {
                        q.select()
                            .from('userpermissions')
                            .where('userpermissions.user_id', '=', req.user.id)
                            .andWhere('userpermissions.location_id', '=', req.params.location_id)
                            .update({
                                subscribed: subscribed
                            })
                    })
                        .fetch({
                            transacting: t
                        })
                        .then(function locationsSubscribeSuccess(userpermission) {
                            res.sendStatus(200);
                        })
                        .catch(function locationsSubscribeError(err) {
                            error(req, res, err);
                        });
                } else {
                    return models.UserPermission.forge({
                        user_id: req.params.user_id,
                        location_id: req.params.location_id,

                    })
                }
            });
    });
}
