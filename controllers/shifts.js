var models = require('../app/models');
var moment = require('moment');

module.exports = {
    route: '/api/shifts',
    '/after/:after/before/:before': {
        'get': { // return all shifts you are connected to
            // auth: // logged in
            route: function(req, res) {
                // fetch the last month of shifts
                // the current month
                // and the next 2 months
                // if the user needs more in the calendar
                // the calendar will request specific ranges
                // TODO: Cache these dates until month ticks?
                var after = req.param("after");
                var before = req.param("before");
                console.log("before: " + before + ", after: " + after);
                var now = new Date();
                if (after === undefined) {
                    after = moment(now)
                        .subtract('1', 'months')
                        .endOf('month')
                        .unix();
                }
                if (before === undefined) {
                    before = moment(now)
                        .add('3', 'months')
                        .startOf('month')
                        .unix();
                }
                if (before > after) {
                    return res.status(400).json({error: true, data: {message: 'Invalid date range'}});
                }
                models.Shifts.forge()
                    .query(function(q) {
                        q.where('start', '<=', before)
                            .orWhere('end', '>=', after)
                    })
                    .fetch()
                    .then(function(collection) {
                        res.json(collection.toJSON());
                    })
                    .catch(function(err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            }
        }
    },
    '/:shift_id': {
        'get': { // get info about a shift
            // auth: // connected to shift (part of location) or managing the shift
            route: function(req, res) {
                models.Shift.forge({id: req.params.shift_id})
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
            }
        },
        'patch': { // update a shift
            // auth: // must be managing the shift
            route: function(req, res) {
                console.log(req.body);
                models.Shift.forge({id: req.params.shift_id})
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
            }
        },
        'delete': { // delete a shift
            // auth: // must be managing the shift
            route: function(req, res) {
                models.Shift.forge({id: req.params.shift_id})
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
            }
        }
    },
    '/all': {
        'get': { // get all shifts you are connected to
            // auth: // logged in
        }
    },
    '/new': {
        'get': { // get new shifts
            // auth: // logged in
        }
    },
    '/managing': {
        'get': { // get shifts you are managing including last months
            // auth: // logged in
        }
    },
    // created in context of /locations
    add: function(req, res) {
        if (req.body.start > req.body.end) {
            res.status(400).json({error: true, data: {message: 'Invalid date range'}})
        }
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
    }
};
