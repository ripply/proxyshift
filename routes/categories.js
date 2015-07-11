module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        categories = require('../controllers/categories'),
        categoriesRouter = express.Router();

    categoriesRouter.get('/', categories.index);
    categoriesRouter.get('/:id', categories.getById);
    categoriesRouter.post('/', categories.add);
    categoriesRouter.put('/', categories.add);
    categoriesRouter.patch('/', categories.update);
    categoriesRouter.delete('/:id', categories.delete);

    app.use(categories.route, categoriesRouter);

};