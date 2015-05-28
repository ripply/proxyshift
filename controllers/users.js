var models = require('../app/models');

module.exports = {
    index: function(req, res) {
        models.Users.forge()
            .fetch()
            .then(function (collection) {
                res.json(collection.toJSON());
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    getById: function(req, res) {
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
    },
    add: function(req, res) {
        console.log('Users add:');
        console.log(req.body);
        models.User.forge({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            squestion: req.body.squestion,
            sanswer: req.body.sanswer
        })
            .save()
            .then(function (user) {
                res.json({id: user.get('id')});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    update: function(req, res) {
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
    },
    delete: function(req, res) {
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
    update: function(req, res) {
        // get the current userid then forward to updateById

    },
    updateById: function(req, res) {

    }
};
