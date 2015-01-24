var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Shift = new Schema({
    start: {type: Date},
    end:   {type: Date}
});

module.exports = {
    Shift: mongoose.model('Shift', Shift)
};
