var models = require('../app/models');

module.exports = {
    index: function(req, res) {
        models.Groups.find({}, function(err, data) {
            res.json(data);
        });
    },
    getById: function(req, res) {
        models.Groups.find({ _id: req.params.id }, function(err, shift) {
            if (err) {
                res.json(404, {error: 'Group not found.'});
            } else {
                res.json(shift);
            }
        });
    },
    add: function(req, res) {
        console.log('Group add:');
        console.log(req.body);
        var newGroups = new models.Groups(req.body);
        newGroups.save(function(err, group) {
            if (err) {
                res.json(403, {error: 'Error creating group.'});
            } else {
                res.json(group);
            }
        });
    },
    update: function(req, res) {
        console.log(req.body);
        models.Groups.update({ _id: req.body.id }, req.body, function(err, updated) {
            if (err) {
                res.json(404, {error: 'Group not found.'});
            } else {
                res.json(updated);
            }
        })
    },
    delete: function(req, res) {
        models.Groups.findOne({ _id: req.params.id }, function(err, shift) {
            if (err) {
                res.json(404, {error: 'Group not found.'});
            } else {
                shift.remove(function(err, shift){
                    res.json(200, {status: 'Success'});
                })
            }
        });
    },
    update: function(req, res) {
        // get the current groupid then forward to updateById

    },
    updateById: function(req, res) {

    }
};
