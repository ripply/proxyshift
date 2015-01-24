var Backbone = require('backbone'),
    ShiftModel = require('../models/shift');

module.exports = ShiftsCollection = Backbone.Collection.extend({
    model:  ShiftModel,
    url: '/api/shifts'
});
