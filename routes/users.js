module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        users = require('../controllers/users'),
        usersRouter = express.Router();

    usersRouter.get('/', users.index);
    usersRouter.get('/:id', users.getById);
    // post comes before authentication so anyone can make an account
    usersRouter.post('/', users.add);
    usersRouter.post('/', users.add);
    usersRouter.patch('/', users.update);
    usersRouter.delete('/:id', users.delete);

    app.use(users.route, usersRouter);

};