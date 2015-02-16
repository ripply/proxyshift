var Backbone = require('backbone');

module.exports = CategoriesEdit = Ractive.extend({
    template: require('../../../templates/categories/edit.html'),

    adaptors: ['Backbone'],

    el: "#header",

    data: {
        categories: [
            {
                id: 0,
                name: 'country'
            },
            {
                id: 1,
                name: 'region',
                parent: 0
            },
            {
                id: 2,
                name: 'locality',
                parent: 0
            },
            {
                id: 3,
                name: 'wut',
                parent: 2
            }
        ]
    },

    computed: {
        tree: function() {
            var categories = this.get('categories');
            // find nodes without parents
            var roots = {};
            var consumed = {};
            var notconsumed = {};
            _.each(categories, function(category, index, list) {
                if (category.parent) {
                    if (roots[category.parent]) {

                    }
                }
            });
        }
    }

});