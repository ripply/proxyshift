var models = require('../app/models'),
    logout = require('../routes/misc/middleware').logout,
    updateModel = require('./controllerCommon').updateModel,
    encryptKey = require('./encryption/encryption').encryptKey,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    Bookshelf = models.Bookshelf;

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
                models.Users.forge()
                    .fetch()
                    .then(function (collection) {
                        res.json(collection.toJSON());
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'post': { // create an account
            // auth: // anyone not logged in
            route: function(req, res) {
                models.User.forge({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: encryptKey(req.body.password),
                    squestion: req.body.squestion,
                    sanswer: encryptKey(req.body.sanswer),
                    phonehome: req.body.phonehome,
                    phonemobile: req.body.phonemobile,
                    pagernumber: req.body.pagernumber
                })
                    .save()
                    .then(function (user) {
                        res.json({id: user.get('id')});
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'patch': { // update your account
            auth: ['current user'], // current logged in user
            route: function(req, res) {
                console.log(req);
                console.log(res);
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
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                }
            }
        }
    },
    '/:user_id': {
        'get': { // get info about another account
            // auth: // your account or admin
            route: function(req, res) {
                models.User.forge({id: req.params.user_id})
                    .fetch()
                    .then(function (user) {
                        if (!user) {
                            res.status(404).json({error: true, data: {}});
                        }

                        if (user.id !== req.user.id) {
                            res.status(401).json({error: true, data: {}});
                        }

                        else {
                            console.log(user.id);
                            console.log(req.params.user_id);
                            console.log(req.user.id);
                            res.json(user.toJSON());
                        }
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'patch': { // update an account
            // auth: // your account or admin
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
        'delete': { // delete another account
            auth: ['server admin'], // admin
            route: function(req, res) {
                if (req.params.user_id === req.user.id) {
                    models.User.query(function(q) {
                        q.select()
                            .from('users')
                            .where({
                                id: req.params.user_id
                            });
                    })
                        .destroy()
                        .then(function() {
                            logout();
                            res.json({error: false, data: {message: 'User successfully deleted'}});
                        })
                        .catch(function (err) {
                            res.status(500).json({error: true, data: {message: err.message}});
                        });
                }
            }
        }
    }
};
