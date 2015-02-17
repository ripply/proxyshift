var Backbone = require('backbone');

module.exports = CategoriesEdit = Ractive.extend({
    template: require('../../../templates/categories/edit.html'),

    adaptors: ['Backbone'],

    el: "#content",

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
            },
            {
                id: 4,
                name: 'parent2'
            }
        ],
        width: function(depth, absoluteMaximumDepth) {
            var interval = (1 / absoluteMaximumDepth) * 100;
            return interval * depth;
        }
    },

    computed: {
        tree: function() {
            console.log('TREE COMPUTED!!');
            var categories = this.get('categories');
            // find nodes without parents
            var roots = [];
            var consumed = {};
            var notConsumed = {};
            var self = this;
            var maxDepth = 0;
            var treeizeCapture = function(value, prop, list) {
                self.treeize(roots, consumed, notConsumed,
                    function(newMaxDepth) {
                        maxDepth = (newMaxDepth > maxDepth ? newMaxDepth:maxDepth);
                    },
                    value, prop, list);
            };
            _.each(categories, treeizeCapture);
            while (Object.keys(notConsumed).length !== 0) {
                var beforeSize = Object.keys(notConsumed).length;
                _.each(notConsumed, treeizeCapture);
                if (beforeSize == Object.keys(notConsumed).length) {
                    // set contains nonconnected nodes
                    console.warn("Notice: set contains nonconnected nodes");
                    console.log("notConsumed set:");
                    console.log(notConsumed);
                    console.log("Consumed set:");
                    console.log(consumed);
                    console.log("Complete set:");
                    console.log(categories);
                    break;
                }
            }
            self.set('maxDepth', maxDepth);
            console.log(roots);
            return roots;
        }
    },

    /**
     * _.each() function that creates a tree structure from a list
     * @param roots
     * @param consumed
     * @param notConsumed
     * @param value
     * @param prop
     * @param list
     */
    treeize: function(roots, consumed, notConsumed, maxDepth, value, prop, list) {
        var child, root, parent = null;
        if (value.parent !== undefined) {
            // has a parent! so this is a child node
            if (consumed[value.parent]) {
                // parent has already been consumed, so it should exist somewhere
                // in the roots tree
                // consumed holds references to the cloned node inside roots
                parent = consumed[value.parent];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                child = _.clone(value);
                child.depth = parent.depth + 1;
                // keep track of what the maximum depth is
                // this callback should set and update the maximum if this is bigger
                maxDepth(child.depth);

                parent.children.push(child);
                consumed[child.id] = child;
                delete notConsumed[value.id];
            } else {
                // parent has not been consumed yet
                // we cannot consume this until it's parent is consumed
                // so put it in notConsumed and continue
                // another loop will be needed to process this
                // (if the parent is in the list)
                if (!notConsumed[value.id]) {
                    child = _.clone(value);
                    notConsumed[value.id] = child;
                }
            }
        } else {
            root = _.clone(value);
            root.depth = 0;
            roots.push(root);
            consumed[root.id] = root;
        }
    }

});