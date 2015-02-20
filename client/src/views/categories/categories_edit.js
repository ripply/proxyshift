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

        /**
         * Removes the given node from its parents and removes its children
         * @param childNode
         */
        var removeChild = function(childNode) {
            if (childNode === undefined) { return; }
            if (childNode.children !== undefined) {
                _.each(childNode.children, function(child, index, list) {
                    removeChild(child);
                });
            }

        };

        /**
         * Searches a tree for a specific node with an id
         * @param currentNode
         * @param lookingForId
         * @returns {*}
         */
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

        // Iterate over each tree root and
        // remove a node from each with the given id if they exist
        // TODO: This does not handle the case where a root has duplicate ids... I think
        for (var i = 0; i < tree.length; i++) {
            foundNode = traverseTreeForChild(tree[i], id);
            if (foundNode !== null) {
                removeChild(foundNode.children[j]);
                return;
            }
        }
    },

    init: function(options) {
        var self = this;
        this.on({
            // Delete a category
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
            // Create an empty category
            'newCategory': function(event, parentId) {
                var categories = this.get('categories');
                if (categories === undefined) {
                    App.core.vent.trigger('error', "Problem with model, cannot create a new category");
                    return;
                }

                var maxId = _.reduce(self.loopOver(categories), function(memo, num) {
                    return (memo > num.id ? memo:num.id);
                }, 0);

                // Backbone will also accept this so no need to do something special
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
/*        categories: [
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
        ],*/
        width: function(depth, absoluteMaximumDepth) {
            if (depth === undefined || absoluteMaximumDepth === undefined) {
                console.log("When computing width of div, arguments are invalid: depth=" + depth + ", maximumDepth=" + absoluteMaximumDepth);
            }
            var interval = (1 / absoluteMaximumDepth) * 100;
            return interval * depth;
        }
    },

    computed: {
        /**
         * Creates a tree like hash from an array
         * @returns {Array}
         */
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
            // perform first pass over categories
            // the first pass will start at roots and try to add as many children as it can without backtracking
            // there will most likely be leftovers that were not handled
            _.each(this.loopOver(categories), treeizeCapture);
            while (Object.keys(notConsumed).length !== 0) {
                var beforeSize = Object.keys(notConsumed).length;
                // here we try to continue creating the tree
                // if there is no change to unconsumed nodes then we stop
                // they might be unconsumed because something could have gone wrong
                // for example, a node has a parent but that parent is not in the given set
                // this would obviously be a server error, but it is here for completeness
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
     * Returns what to loop over given a model.
     *
     * If the model is a Backbone model then it will loop over the models attribute
     * Otherwise the argument will be returned
     *
     * @param categories
     * @returns {*}
     */
    loopOver: function(categories) {
        if ('models' in categories) {
            return categories.models;
        } else {
            return categories;
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
        var copyAttributesToObject = function(object) {
            // if it is a Backbone model
            // we need to set the attributes in normal methods
            // instead of using getters/setters
            // normally the backbone adapter would handle this for the templates
            // but since we are making a custom tree object
            // the template does not know that each child is a backbone model
            if ('attributes' in object) {
                _.each(object.attributes, function(value, prop, list) {
                    object[prop] = value;
                });
            }
        };

        if (value.get('parent') !== undefined) {
            // has a parent! so this is a child node
            if (consumed[value.get('parent')]) {
                // parent has already been consumed, so it should exist somewhere
                // in the roots tree
                // consumed holds references to the cloned node inside roots
                parent = consumed[value.get('parent')];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                child = _.clone(value);

                copyAttributesToObject(child);

                var depth = parent.depth;
                if (depth == undefined) {
                    depth = parent.get('depth');
                }
                child.depth = depth + 1;
                // keep track of what the maximum depth is
                // this callback should set and update the maximum if this is bigger
                maxDepth(depth);

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
            root.set('depth', 0);

            copyAttributesToObject(root);

            roots.push(root);
            consumed[root.id] = root;
        }
    }

});