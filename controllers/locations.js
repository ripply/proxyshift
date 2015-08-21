var models = require('../app/models'),
    updateModel = require('./controllerCommon').updateModel,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    Bookshelf = models.Bookshelf,
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
    '/:location_id/shifts': {
        'get': { // get all shifts you are eligible for in a location?
            auth: ['group owner', 'or', 'group member'], // must be a member/owner of the group
            route: function (req, res) {
                simpleGetListModel('GroupUserClass',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        }
    },
    '/:location_id/shifts/after/:after/before/:before': {
        'get': { // subroute of /:location_id/shifts with time constraints
            auth: ['location member'], // must be member of a location
            route: function(req, res) {

            }
        }
    },
    '/:location_id/shifts/:groupuserclass': {
        'get': { // get shifts in a location that are of a
            // if privileged allow any groupuserclass
            // else, only allow ones you are a member of
            auth: ['location members'],
            route: function(req, res) {

            }
        }
    },
    '/:location_id/sublocation': {
        'get': { // get all sublocations
            auth: ['location member'], // must be attached to the location
            route: function(req, res) {

            }
        },
        'post': { // create a sublocation
            auth: ['privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {

            }
        }
    },
    '/:location_id/sublocation/:sublocation_id': {
        'patch': { // update a sublocation
            auth: ['privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {

            }
        },
        'delete': { // delete a sublocation
            auth: ['privileged location member'], // must be a group owner or privileged group member attached to location
            route: function(req, res) {

            }
        }
    }
};
