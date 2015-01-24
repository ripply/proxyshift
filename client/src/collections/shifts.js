var Backbone = require('backbone'),
    ShiftModel = require('../models/shift');

module.exports = ShiftsCollection = Backbone.Shift.extend({
    model:  ShiftModel,
    url: '/api/shifts'
});
