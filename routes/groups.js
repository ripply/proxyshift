module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        groups = require('../controllers/groups'),
        groupsRouter = express.Router();

    // GET / - list all groups you are a part of or own
    groupsRouter.get('/', groups.getOwnGroups);
    // GET /:id - info about a group
    groupsRouter.get('/:id', groups.getById);
    // GET /classes - get all groupuserclasses for this group
    // GET /:id/permissions - get your group permissins
    // GET /:id/permissions/:id - get a users group permissions
    // GET /:id/users - get all group members
    // POST / - create a group
    // POST /:id/permissions - create a group permission set
    groupsRouter.post('/', groups.add);
    // POST /:id/area - create an area
    // POST /:id/locations - create a location
    // POST /:id/user/:id - add a user to a group

    // PUT / - same as POST
    groupsRouter.put('/', groups.add);
    // PUT /:id/location - same as POST

    // PATCH /:id - update a group
    groupsRouter.patch('/:id', groups.update);
    // PATCH /:id/permissions/:id - update a group permission set
    // DELETE /:id - delete a group
    groupsRouter.delete('/:id', groups.delete);
    // DELETE /:id/permissions/:id - delete a group permission set
    // DELETE /:id/users/:id - remove a user from a group
    // DELETE /:id/area/:id - remove an area from this group

    app.use(groups.route, groupsRouter);

};
