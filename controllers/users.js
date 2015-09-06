var models = require('../app/models'),
    logout = require('../routes/misc/middleware').logout,
    updateModel = require('./controllerCommon').updateModel,
    encryptKey = require('./encryption/encryption').encryptKey,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    error = require('./controllerCommon').error,
    Bookshelf = models.Bookshelf;

// NO-OPing, encrypti si done backend now
encryptKey = function(value) {
    return value;
};

var modifiableAccountFields = [
    'id',
    'username',
    'email',
    'password', // require special route
    'squestion',
    'sanswer'
];

module.exports = {
    route: '/api/users',
    '/': {
        'get': { // get info about your account
            // auth: // anyone logged in
            route: function(req, res) {
                simpleGetSingleModel(
                    'User',
                    {
                        id: req.user.id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create an account
            // auth: // anyone not logged in
            route: function(req, res) {
                postModel(
                    'User',
                    {

                    },
                    req,
                    res,
                    [
                        'id'
                    ]
                );
            }
        },
        'patch': { // update your account
            auth: ['current user'], // current logged in user
            route: function(req, res) {
                patchModel(
                    'User',
                    {
                        id: req.user.id
                    },
                    req,
                    res,
                    'Account updated',
                    modifiableAccountFields
                );
            }
        },
        'delete': { // delete your account
            // auth: // logged in
            route: function(req, res) {
                // TODO: Verify that deleting account logs you out
                /*
                deleteModel(
                    'User',
                    {
                        id: req.params.id
                    },
                    req,
                    res,
                    'Account successfully deleted'
                );
                */
                if (req.body.password === undefined) {
                    res.status(400) // bad request
                        .json({error: true, data: {message: 'Password required'}});

                } else {
                    models.User.query(function (q) {
                        q.select()
                            .from('users')
                            .where({
                                id: req.user.id,
                                // require password to delete account
                                password: encryptKey(req.body.password)
                            });
                    })
                        .destroy()
                        .then(function () {
                            logout(req, res);
                            res.json({error: false, data: {message: 'User successfully deleted'}});
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                }
            }
        }
    },
    '/:user_id': {
        'get': { // get info about another account
            // auth: // your account or admin
            route: function(req, res) {
                var currentId = parseInt(req.user.id);
                var user_id = parseInt(req.params.user_id);

                if (user_id !== currentId) {
                    res.status(401).json({error: true, data: {}});
                }

                else {
                    models.User.forge({id: req.params.user_id})
                        .fetch()
                        .then(function (user) {
                            if (!user) {
                                res.status(404).json({error: true, data: {}});
                            }

                            else {
                                res.json(user.toJSON());
                            }
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                }
            }
        },
        'patch': { // update an account
            // auth: // your account or admin
            route: function(req, res) {
                var currentId = parseInt(req.user.id);
                var user_id = parseInt(req.params.user_id);

                if (user_id !== currentId) {
                    res.status(401).json({error: true, data: {}});
                }

                else {
                    patchModel(
                        'User',
                        {
                            id: req.user.id
                        },
                        req,
                        res,
                        'Account updated',
                        modifiableAccountFields
                    );
                }

            }
        },
        'delete': { // delete another account
            //auth: ['server admin'], // admin
            route: function(req, res) {
                var currentId = parseInt(req.user.id);
                var user_id = parseInt(req.params.user_id);

                if (user_id !== currentId) {
                    res.status(401).json({error: true, data: {}});
                }

                else {
                    models.User.query(function(q) {
                        q.select()
                            .from('users')
                            .where({
                                id: req.params.user_id
                            });
                    })
                        .destroy()
                        .then(function() {
                            res.json({error: false, data: {message: 'User successfully deleted'}});
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                }
            }
        }
    }
};
