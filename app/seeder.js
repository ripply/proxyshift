var mongoose = require('mongoose'),
    models = require('./models'),
    md5 = require('MD5');

module.exports = {
    check: function() {
        models.Shift.find({}, function(err, shifts) {
            if (shifts.length === 0) {
                console.log('no shifts found, seeding...');
                var newShift = new models.Shift({
                    start: Date.now(),
                    end: Date.now()
                });
                newShift.save(function(err, shift) {
                    console.log('successfully inserted shift: ' + shift._id);
                });

                newShift = new models.Shift({
                    start: Date.now(),
                    end: Date.now()
                });
                newShift.save(function(err, shift) {
                    console.log('successfully inserted shift: ' + shift._id);
                });

                newShift = new models.Shift({
                    start: Date.now(),
                    end: Date.now()
                });
                newShift.save(function(err, shift) {
                    console.log('successfully inserted shift: ' + shift._id);
                });
            } else {
                console.log('found ' + shifts.length + ' existing shifts!');
                console.log(shifts);
            }
        });
    }
};
