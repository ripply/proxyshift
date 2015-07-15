var models = require('../app/models');
var encryptKey = require('./encryption/encryption').encryptKey;

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
            // auth: // logged in
        },
        'delete': { // delete your account
            // auth: // logged in
            route: function(req, res) {
                models.User.forge({id: req.params.id})
                    .fetch({require: true})
                    .then(function (user) {
                        user.destroy()
                            .then(function () {
                                res.json({error: true, data: {message: 'User successfully deleted'}});
                            })
                            .catch(function (err) {
                                res.status(500).json({error: true, data: {message: err.message}});
                            });
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            },
        }
    },
    '/:id': {
        'get': { // get info about another account
            // auth: // your account or admin
            route: function(req, res) {
                models.User.forge({id: req.params.id})
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
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        },
        'patch': { // update an account
            // auth: // your account or admin
            route: function(req, res) {
                console.log(req.body);
                models.User.forge({id: req.params.id})
                    .fetch({require: true})
                    .then(function (user) {
                        user.save({
                            name: req.body.name || user.get('name'),
                            email: req.body.email || user.get('email')
                        })
                            .then(function () {
                                res.json({error: false, data: {message: 'User details updated'}});
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
        'delete': { // delete another account
            // auth: // your account or admin
        }
    }
};
