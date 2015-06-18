var models = require('../app/models');

module.exports = {
    index: function(req, res) {
        models.Groups.forge()
            .fetch()
            .then(function (collection) {
                res.json(collection.toJSON());
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    getById: function(req, res) {
        models.Group.forge({id: req.params.id})
            .fetch()
            .then(function (group) {
                if (!group) {
                    res.status(404).json({error: true, data: {}});
                }
                else {
                    res.json(group.toJSON());
                }
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    getOwnGroups: function(req, res) {
        models.Group.query(function(q) {
            q.select('groups.*').innerJoin('usergroups', function() {
                this.on('groups.id', '=', 'usergroups.groupid')
                    .andOn('usergroups.userid', '=', req.user.id);
            })
                .union(function() {
                    this.select('*')
                        .from('groups')
                        .where('ownerid', '=', req.user.id);
                });
        })
            .fetchAll()
            .then(function (groups) {
                res.json(groups.toJSON());
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    add: function(req, res) {
        models.Group.forge({
            ownerid: req.user.id,
            name: req.body.name,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            zipcode: req.body.zipcode,
            weburl: req.body.weburl,
            contactemail: req.body.contactemail,
            contactphone: req.body.contactphone
        })
            .save()
            .then(function (group) {
                res.json({id: group.get('id')});
                console.log('Group added:');
                console.log(group);
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    update: function(req, res) {
        console.log(req.body);
        models.Group.forge({id: req.params.id})
            .fetch({require: true})
            .then(function (group) {
                group.save({
                    groupname: req.body.groupname|| group.get('groupname')
                })
                    .then(function () {
                        res.json({error: false, data: {message: 'Group details updated'}});
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
        models.Group.forge({id: req.params.id})
            .fetch({require: true})
            .then(function (group) {
                group.destroy()
                    .then(function () {
                        res.json({error: true, data: {message: 'Group successfully deleted'}});
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
        // get the current groupid then forward to updateById

    },
    updateById: function(req, res) {

    }
};
