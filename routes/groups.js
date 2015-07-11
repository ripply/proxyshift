module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        groups = require('../controllers/groups'),
        groupsRouter = express.Router();

    groupsRouter.get('/', groups.getOwnGroups);
    groupsRouter.get('/:id', groups.getById);
    groupsRouter.post('/', groups.add);
    groupsRouter.put('/', groups.add);
    groupsRouter.patch('/', groups.update);
    groupsRouter.delete('/:id', groups.delete);

    app.use(groups.route, groupsRouter);

};