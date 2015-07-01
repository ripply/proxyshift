var models = require('../app/models');

function encryptKey(password) {
    if (password === null || password.length === 0) {
        return null;
    } else {
        // Load the bcrypt module
        var bcrypt = require('bcrypt-nodejs');
        // Generate a salt
        var salt = bcrypt.genSaltSync(10);
        // Hash the password with the salt
        var hash = bcrypt.hashSync(password, salt);

        return  hash;
    }
}

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
                console.log('User added:');
                console.log(user);
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
