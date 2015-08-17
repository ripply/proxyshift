var models = require('../app/models'),
    updateModel = require('./controllerCommon').updateModel,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    Bookshelf = models.Bookshelf,
    moment = require('moment');

module.exports = {
    route: '/api/locations',
    '/': {
        'get': { // list all locations a part of
            auth: ['anyone'], // anyone can query what locations they are a part of
            route: function (req, res) {
                models.Locations.forge({id: req.params.id})
                    .fetchAll()
                    .then(function (groups) {
                        res.json(groups.toJSON());
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'post': {
            auth: ['anyone'], // anyone can create a shift
            route: function (req, res) {
                Bookshelf.transaction(function (t) {
                    return models.GroupSetting.forge({})
                        .save(null, {transacting: t})
                        .tap(function (groupsetting) {
                            return models.Group.forge({
                                groupsetting_id: groupsetting.id,
                                user_id: req.user.id,
                                name: req.body.name,
                                state: req.body.state,
                                city: req.body.city,
                                address: req.body.address,
                                zipcode: req.body.zipcode,
                                weburl: req.body.weburl,
                                contactemail: req.body.contactemail,
                                contactphone: req.body.contactphone
                            })
                                .save(null, {transacting: t})
                                .tap(function (group) {
                                    return models.UserGroup.forge({
                                        user_id: req.user.id,
                                        group_id: group.id
                                    })
                                        .save(null, {transacting: t});
                                })
                        })
                })
                    .then(function (group) {
                        res.json({id: group.get('id')});
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/:location_id/shifts': {
        'get': { // get list of all class types
            auth: ['group owner', 'or', 'group member'], // must be a member/owner of the group
            route: function(req, res) {
                simpleGetListModel('GroupUserClass',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create new class for group
            auth: ['group owner', 'or', 'privileged location member', 'or', ['anyone can create shifts', 'and', 'location member']], // must be an owner or privileged group member
            route: function(req, res) {
                postModel('Shifts',
                    {
                        location_id: req.params.location_id
                    },
                    req,
                    res
                );
            }
        }
    }
}
