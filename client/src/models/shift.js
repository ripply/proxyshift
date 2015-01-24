var Backbone = require('backbone');

module.exports = ShiftModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/shifts'
});
