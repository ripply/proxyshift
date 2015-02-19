var Backbone = require('backbone');

module.exports = CategoryModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/categories'
});
