module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        locations = require('../controllers/areas'),
        locationsRouter = express.Router();

    // GET / - list of all areas you have access to
    // GET /:id - get info about an area
    // POST /:id/location/:id - add location to area
    // PATCH /:id - update an area
    // DELETE /:id - delete an area
    // DELETE /:id/location/:id - remove a location from an area

    //app.use(locations.route, locationsRouter);

};
