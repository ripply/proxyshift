var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Shift = new Schema({
    title:       {type: String},
    description: {type: String},
    allDay:      {type: Boolean, default: false},
    recurring:   {type: Boolean, default: false},
    start:       {type: Date, required: true},
    end:         {type: Date, required: true}
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
