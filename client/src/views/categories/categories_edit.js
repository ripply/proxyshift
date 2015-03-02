var Backbone = require('backbone');

module.exports = CategoriesEdit = Ractive.extend({
    template: require('../../../templates/categories/edit.html'),

    adaptors: ['Backbone'],

    el: "#content",

    /**
     * Removes the given node from its parents and removes its children
     * @param childNode
     */
    removeChild: function(childNode, pending) {
        if (childNode === undefined) { return; }

        if (pending === undefined || pending === null) {
            pending = [];
        }

        pending.push(childNode);

        if (childNode.children !== undefined) {
            var self = this;
            _.each(childNode.children, function(child, index, list) {
                if (child in pending) {
                    // do nothing to prevent infinite recursion
                } else {
                    pending.push(child);
                    self.removeChild(child, pending);
                }
            });
        }

        // remove child
        var nodes = this.get('categories');
        if (nodes.remove(childNode) === undefined) {
            console.log("Child to remove does not exist in categories");
        }
    },

    /**
     * Searches a tree for a specific node with an id
     * @param currentNode
     * @param lookingForId
     * @returns {*}
     */
    traverseTreeForChild: function(currentNode, lookingForId) {
        if (lookingForId === undefined) { return null; }
        if (currentNode === undefined) { return null; }
        if (currentNode.id === lookingForId) { return currentNode; }
        if (currentNode.children === undefined) { return null; }

        var foundChild;
        // recurse into children
        var children = currentNode.children;
        for (var i = 0; i < children.length; i++) {
            foundChild = this.traverseTreeForChild(children[i], lookingForId);
            if (foundChild !== null) {
                return foundChild;
            }
        }

        return null;
    },

    removeChildren: function(id) {
        // Compute tree, then just use that to get the nodes to delete
        // there should never be any cycles in this tree
        var categories = this.get('categories');
        var tree = this.get('tree');

        // no children to remove if there is no tree
        if (tree.length === 0) { return; }

        var foundNode;
        // Iterate over each tree root and
        // remove a node from each with the given id if they exist
        // TODO: This does not handle the case where a root has duplicate ids... I think
        for (var i = 0; i < tree.length; i++) {
            foundNode = this.traverseTreeForChild(tree[i], id);
            if (foundNode !== null) {
                this.removeChild(foundNode);
                return;
            }
        }

        console.log("Failed to locate id " + id + " to remove");
    },

    generateNewId: function() {
        var maxId = _.reduce(self.loopOver(categories), function(memo, num) {
            return (memo > num.id ? memo:num.id);
        }, 0);
    },

    init: function(options) {
        _.bindAll(this, 'removeChild', 'removeChildren', 'generateNewId');
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
                    _.each(self.loopOver(categories), function(category, index, list){
                        if (category !== undefined) {
                            if (category.id === id) {
                                self.removeChildren(category.id);
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

                var newCategoryCount = _.reduce(self.loopOver(categories), function(memo, num) {
                    if (num.get('newItem')) {
                        memo += 1;
                    }
                    return memo;
                }, 0);

                // Check if the parent has text
                // Nodes without text cannot have children
                _.each(self.loopOver(categories), function(category, index, list){
                    if (category !== undefined) {
                        if (category.id === parentId) {
                            if (category.name === undefined ||
                                category.name === '') {
                                // name is empty, do not continue
                                return;
                            }
                        }
                    }
                });

                // Push a new category onto the backbone model
                // this will not trigger a POST to the server
                // we can trigger a POST when data is entered
                categories.push({
                    _id: 'new' + (newCategoryCount + 1),
                    newItem: true,
                    parent: parentId,
                    name: ''
                });
                this.update();
            },
            'updateCategory': function(event, id) {
                var context = event.context;

                var originalName = context.get('originalName');
                if (originalName === undefined) {
                    var currentName = context.get('name');
                    context.set('originalName', currentName);
                    originalName = currentName;
                }

                var newName = event.node.value;
                if (newName === undefined || newName === null || newName === '') {
                    newName = originalName;
                }

                context.set('name', newName);
                this.update();
            },
            'save': function(event) {
                if (this.get('saving')) {
                    // code already running
                    return;
                }
                this.set('saving', true);
                var categories = this.get('categories');
                var newCategories = [];
                var notModified = {};
                var modified = [];
                // find what is new and has been modified
                _.each(this.loopOver(categories), function(category, index, list) {
                    var originalName = category.get('originalName');
                    if (category.get('newItem')) {
                        newCategories.push(category);
                    } else if (originalName !== undefined && (originalName !== category.get('name'))) {
                        modified.push(category);
                    } else {
                        // this node has not been modified
                        // no reason to push to server

                        // add object to hash for easy object lookup
                        notModified[category.id] = category;
                    }
                });
                // try to create new objects first
                // we need to figure out which order to create them in
                // so lets first find objects that have existing parents with ids in the database
                var createOrder = [];
                var inCreateOrder = {};
                var capture = function(category, index, list) {
                    var parent = category.get('parent');
                    if (parent === undefined ||
                        parent === null) {
                        // this category has no parent which makes it a root
                        // so there is nothing special for odering we have to do for this
                        // (besides its children need to be added after)
                        createOrder.push(category);
                        inCreateOrder[category.id] = category;
                    } else if (category.id in createOrder) {
                        // parent already going to be created
                        // add it to the list
                        createOrder.push(category);
                        inCreateOrder[category.id] = category;
                    } else if (category.get('parent') in notModified) {
                        // parent exists and it doesn't need to be modified!
                        createOrder.push(category);
                        inCreateOrder[category.id] = category;
                    } else {
                        // not a root
                        // parent not yet added
                        // skip this and hopefully the next iteration will pick it up
                    }
                };

                var categoriesToUpdateCount = newCategories.length + inCreateOrder.length;
                _.each(this.loopOver(newCategories), capture);
                while (createOrder.length < categoriesToUpdateCount) {
                    var createOrderLength = createOrder.length;
                    _.each(this.loopOver(newCategories), capture);
                    if (createOrder.length == createOrderLength) {
                        console.log('Disconnected nodes exist, not saving those');
                        break;
                    }
                }
                // iterate over modified keys and save them
                // because this code gets run asynchronously
                // we need to make sure that we are running the updates asynchronously
                var self = this;
                // function that gets called after updating succeeds or fails
                // to re-enable the save button in the template
                var savingComplete = function(fetch) {
                    self.set('saving', false);
                    if (fetch) {
                        self.set('fetching', true);
                        self.get('categories').fetch({
                            success: function() {
                                self.set('fetching', false);
                            },
                            error: function() {
                                self.set('fetching', false);
                            }
                        });
                    }
                };
                var pushUpdate = function(modifiedIndex, createIndex) {
                    if (modifiedIndex < modified.length) {
                        // modifications still need to be made
                        modified[modifiedIndex].save({patch: true, wait: true}, {
                            success: function(model, res, options) {
                                App.core.vent.trigger('app:info', 'Successfully modified category ' + model.get('name'));
                                pushUpdate(modifiedIndex + 1, createIndex);
                            },
                            error: function(model, res, options) {
                                App.core.vent.trigger('app:warning', res.responseJSON);
                                savingComplete(true);
                            }
                        })
                    } else {
                        if (createIndex < createOrder.length) {
                            // modifications have been pushed to server
                            // so we need to create the new objects
                            // when we create them on the server
                            // the server should respond with the new object
                            var newCategory = createOrder[createIndex];
                            newCategory.set('_id', undefined);
                            createOrder[createIndex].save({wait: true}, {
                                success: function (model, res, options) {
                                    App.core.vent.trigger('app:info', 'Successfully created category ' + model.get('name'));
                                    pushUpdate(modifiedIndex, createIndex + 1);
                                },
                                error: function (model, res, options) {
                                    App.core.vent.trigger('app:warning', res.responseJSON);
                                    savingComplete(true);
                                }
                            });
                        } else {
                            // Creating objects has completed!
                            savingComplete();
                        }
                    }
                };

                pushUpdate(0, 0);
                /*.save(function(err) {
                    if (err) {
                        console.log("Failed to save categories");
                    } else {
                        console.log("Successfuly saved?");
                    }
                });*/
                this.set('saving', false);
            }
        });
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
        },
        loading: function() {

        },
        /**
         * Checks whether any items have been modified and need to be sent to server
         * @returns {boolean}
         */
        modified: function() {
            // check categories for newItem === true
            var categories = this.get('categories');
            var loopOverVar = this.loopOver(categories);
            for (var i = 0; i < loopOverVar.length; i++) {
                var value = loopOverVar[i];
                // checking for new items
                if (value.get('newItem')) {
                    return true;
                }
                // checking for modified text
                var originalName = value.get('originalName');
                if (originalName !== undefined &&
                    originalName !== value.get('name')) {
                    return true;
                }
            }

            return false;
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
                if (depth === undefined) {
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