var Backbone = require('backbone');

module.exports = CategoriesEdit = Ractive.extend({
    template: require('../../../templates/categories/edit.html'),

    adaptors: ['Backbone'],

    el: "#content",

    removeChildren: function(id) {
        // Compute tree, then just use that to get the nodes to delete
        // there should never be any cycles in this tree
        var categories = this.get('categories');

        var tree = this.get('tree');

        if (tree.length === 0) { return; }

        var removeChild = function(childNode) {
            if (childNode === undefined) { return; }
            if (childNode.children !== undefined) {
                _.each(childNode.children, function(child, index, list) {
                    removeChild(child);
                });
            }

        };

        var traverseTreeForChild = function(currentNode, lookingForId) {
            if (currentNode === undefined) { return null; }
            if (currentNode.id === lookingForId) { return currentNode; }
            if (currentNode.children === undefined) { return null; }

            var foundChild;
            // recurse into children
            for (var i = 0; i < currentNode.children.length; i++) {
                foundChild = traverseTreeForChild();
                if (foundChild !== null) {
                    return foundChild;
                }
            }

            return null;
        };

        var foundNode;

        for (var i = 0; i < tree.length; i++) {
            foundNode = traverseTreeForChild(tree[i], id);
            if (foundNode !== null) {
                removeChild(foundNode.children[j]);
                return;
            }
        }
    },

    init: function(options) {
        this.on({
            'delCategory': function(event, id) {
                var categories = this.get('categories');
                var self = this;
                if (categories.length > 1) {
                    // find the category object in the object with the specified id
                    // delete its children
                    // then delete it
                    _.each(categories, function(category, index, list){
                        if (category !== undefined) {
                            if (category.id == id) {
                                self.removeChildren(categories.id);
                                delete categories[index];
                            }
                        }
                    });
                }
                this.update();
            },
            'newCategory': function(event, parentId) {
                var categories = this.get('categories');
                var maxId = _.reduce(categories, function(memo, num) {
                    return (memo > num ? memo:num);
                }, 0);
                categories.push({
                    id: maxId + 1,
                    parent: parentId,
                    name: ''
                });
                this.update();
            }
        });
    },

    data: {
        categories: [
            {
                id: 0,
                name: 'country',
                inUse: true
            },
            {
                id: 1,
                name: 'region',
                parent: 0,
                inUse: true
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