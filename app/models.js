var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Shift = new Schema({
    start: {type: Date, required: true},
    end:   {type: Date, required: true}
});

Shift.pre('validate', function (next) {
    if (this.start > this.end)  {
        next(new Error('Ending time must be after starting time'));
    } else {
        next();
    }
});

module.exports = {
    Shift: mongoose.model('Shift', Shift)
};
