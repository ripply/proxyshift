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
    // GET /:id/users - get all group members
    // GET /:id/users/:id/permissions - get a users group permissions
    // GET /:id/class - get all groupuserclasses
    // GET /:id/class/:id - get a specific groupuserclass
    // GET /:id/areas - get all areas attached
    // GET /:id/locations - get all locations attached
    // POST / - create a group
    // POST /:id/permissions - create a group permission set
    groupsRouter.post('/', groups.add);
    // POST /:id/areas - create an area
    // POST /:id/locations - create a location
    // POST /:id/users/:id/permissions/:id - add a user to a group
    // POST /:id/classes - create a groupuserclass

    // PUT / - same as POST
    groupsRouter.put('/', groups.add);
    // PUT /:id/location - same as POST

    // PATCH /:id - update a group and group settings
    groupsRouter.patch('/:id', groups.update);
    // PATCH /:id/permissions/:id - update a group permission set
    // PATCH /:id/users/:id/permissions/:id - update a users permission set
    // PATCH /:id/classes/:id - update a groupuserclass
    // DELETE /:id - delete a group
    groupsRouter.delete('/:id', groups.delete);
    // DELETE /:id/permissions/:id - delete a group permission set
    // DELETE /:id/users/:id - remove a user from a group
    // DELETE /:id/areas/:id - remove an area from this group
    // DELETE /:id/locations/:id - remove a location from a group
    // DELETE /:id/classes/:id - remove a groupuserclass

    app.use(groups.route, groupsRouter);

};
