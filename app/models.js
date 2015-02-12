var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    SALT_WORK_FACTOR = 10;

var shiftSchema = new Schema({
    title:       {type: String},
    description: {type: String},
    allDay:      {type: Boolean, default: false},
    recurring:   {type: Boolean, default: false},
    start:       {type: Date, required: true},
    end:         {type: Date, required: true}
});

shiftSchema.pre('validate', function (next) {
    if (this.start > this.end)  {
        next(new Error('Ending time must be after starting time'));
    } else {
        next();
    }
});

var userSchema = new Schema({
    name:        {type: String, required: false},
    username:    {type: String, required: true, unique: true},
    email:       {type: String, required: true, unique: true},
    password:    {type: String, required: true}
});

userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.method('toJSON', function() {
    var user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
});

users = mongoose.model('Users', userSchema);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    users.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = {
    Shift: mongoose.model('Shift', shiftSchema),
    Users: users
};
