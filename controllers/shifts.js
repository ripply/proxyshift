var models = require('../app/models');

module.exports = {
    index: function(req, res) {
        models.Shift.find({}, function(err, data) {
            res.json(data);
        });
    },
    getById: function(req, res) {
        models.Shift.find({ _id: req.params.id }, function(err, shift) {
            if (err) {
                res.json(404, {error: 'Shift not found.'});
            } else {
                res.json(shift);
            }
        });
    },
    add: function(req, res) {
        console.log('Shift add:');
        console.log(req.body);
        var newShift = new models.Shift(req.body);
        newShift.save(function(err, shift) {
            if (err) {
                res.json(403, {error: 'Error creating shift.'});
            } else {
                res.json(shift);
            }
        });
    },
    update: function(req, res) {
        console.log(req.body);
        models.Shift.update({ _id: req.body.id }, req.body, function(err, updated) {
            if (err) {
                res.json(404, {error: 'Shift not found.'});
            } else {
                res.json(updated);
            }
        })
    },
    delete: function(req, res) {
        models.Shift.findOne({ _id: req.params.id }, function(err, shift) {
            if (err) {
                res.json(404, {error: 'Shift not found.'});
            } else {
                shift.remove(function(err, shift){
                    res.json(200, {status: 'Success'});
                })
            }
        });
    }
};