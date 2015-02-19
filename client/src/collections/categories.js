var Backbone = require('backbone'),
    CategoryModel = require('../models/category');

module.exports = CategoriesCollection = Backbone.Collection.extend({
    model:  CategoryModel,
    url: '/api/categories'
});
