module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        shifts = require('../controllers/shifts'),
        shiftsRouter = express.Router();

    shiftsRouter.get('/', shifts.index);
    shiftsRouter.get('/:id', shifts.getById);
    shiftsRouter.post('/', shifts.add);
    shiftsRouter.put('/', shifts.add);
    shiftsRouter.patch('/', shifts.update);
    shiftsRouter.delete('/:id', shifts.delete);

    app.use(shifts.route, shiftsRouter);

};