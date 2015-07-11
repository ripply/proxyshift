var models = require('../app/models');

module.exports = {
    route: '/api/categories',
    index: function(req, res) {
        models.Category.find({}, function(err, data) {
            res.json(data);
        });
    },
    getById: function(req, res) {
        models.Category.find({ _id: req.params.id }, function(err, Category) {
            if (err) {
                res.json(404, {error: 'Category not found: ' + err});
            } else {
                res.json(Category);
            }
        });
    },
    add: function(req, res) {
        console.log('Category add:');
        console.log(req.body);
        var newCategory = new models.Category(req.body);
        newCategory.save(function(err, Category) {
            if (err) {
                res.json(403, {error: 'Error creating category: ' + err});
            } else {
                res.json(Category);
            }
        });
    },
    update: function(req, res) {
        console.log(req.body);
        models.Category.update({ _id: req.body.id }, req.body, function(err, updated) {
            if (err) {
                res.json(404, {error: 'Category not found: ' + err});
            } else {
                res.json(updated);
            }
        })
    },
    delete: function(req, res) {
        models.Category.findOne({ _id: req.params.id }, function(err, Category) {
            if (err) {
                res.json(404, {error: 'Category not found: ' + err});
            } else {
                Category.remove(function(err, Category){
                    res.json(200, {status: 'Success'});
                })
            }
        });
    }
};
