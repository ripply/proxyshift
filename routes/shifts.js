module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        shifts = require('../controllers/shifts'),
        shiftsRouter = express.Router();

    // GET /:id - get all shifts you manage
    shiftsRouter.get('/:id', shifts.getById);
    // GET /all - get all shifts you are attached to
    // GET /new - get new shifts you are attached to
    // GET /managing - get all shifts you are managing including the last month
    // TODO: APPLY FOR SHIFT
    // PATCH /managing/:id - update a shift
    // DELETE /managing/:id - delete a shift
    //shiftsRouter.delete('/managing/:id', shifts.deleteById);

    shiftsRouter.post('/', shifts.add);
    shiftsRouter.put('/', shifts.add);
    shiftsRouter.patch('/', shifts.update);

    app.use(shifts.route, shiftsRouter);

};
