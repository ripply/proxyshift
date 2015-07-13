module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        users = require('../controllers/users'),
        usersRouter = express.Router();

    // GET / - get info about your account
    usersRouter.get('/', users.index);
    // GET /:id - get info about another account
    usersRouter.get('/:id', users.getById);
    // post comes before authentication so anyone can make an account
    // POST / - create an account
    usersRouter.post('/', users.add);
    // PATCH / - update your account
    usersRouter.patch('/', users.update);
    // PATCH /:id - update an account
    usersRouter.patch('/:id', users.updateById);
    // DELETE / -  delete your account
    usersRouter.delete('/', users.delete);
    // DELETE /:id - delete an account
    //usersRouter.delete('/:id', users.deleteById);

    app.use(users.route, usersRouter);

};
