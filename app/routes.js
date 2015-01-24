var home = require('../controllers/home'),
    shifts = require('../controllers/shifts');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/api/shifts', shifts.index);
    app.get('/api/shifts/:id', shifts.getById);
    app.post('/api/shifts', shifts.add);
    app.put('/api/shifts', shifts.update);
    app.delete('/api/shifts/:id', shifts.delete);
};
