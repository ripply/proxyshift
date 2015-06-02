var models = require('../app/models');

module.exports = {
    index: function(req, res) {
        models.Shifts.forge()
            .fetch()
            .then(function (collection) {
                res.json(collection.toJSON());
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    getById: function(req, res) {
        models.Shift.forge({id: req.params.id})
            .fetch()
            .then(function (shift) {
                if (!shift) {
                    res.status(404).json({error: true, data: {}});
                }
                else {
                    res.json(shift.toJSON());
                }
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    add: function(req, res) {
        models.Shift.forge({
            title: req.body.title,
            description: req.body.description,
            allday: req.body.allday,
            recurring: req.body.recurring,
            start: req.body.start,
            end: req.body.end
        })
            .save()
            .then(function (shift) {
                res.json({id: shift.get('id')});
                console.log('Shift added:');
                console.log(shift);
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    update: function(req, res) {
        console.log(req.body);
        models.Shift.forge({id: req.params.id})
            .fetch({require: true})
            .then(function (shift) {
                shift.save({
                    title: req.body.title|| shift.get('title'),
                    description: req.body.description|| shift.get('description'),
                    start: req.body.start|| shift.get('start'),
                    end: req.body.end|| shift.get('end')
                })
                    .then(function () {
                        res.json({error: false, data: {message: 'Shift details updated'}});
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
        models.Shift.forge({id: req.params.id})
            .fetch({require: true})
            .then(function (shift) {
                shift.destroy()
                    .then(function () {
                        res.json({error: true, data: {message: 'Shift successfully deleted'}});
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
        // get the current shiftid then forward to updateById

    },
    updateById: function(req, res) {

    }
};
