module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        locations = require('../controllers/locations'),
        locationsRouter = express.Router();

    // GET / - list of all locations you have access to
    // GET /:id - get info about a location
    // GET /shift - get all shifts
    // GET /new - get new shifts
    // GET /open - get open shifts
    // GET /:id/permissions - get your permissions for this location
    // GET /:id/permissions/:id - get permissions for user
    // POST /shift - create a shift for this location
    // PATCH /:id - update a location
    // PATCH /:id/permissions/:id - update a users permissions
    // DELETE /:id - delete a location

    app.use(locations.route, locationsRouter);

};
