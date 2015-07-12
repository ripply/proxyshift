// Divide all of your modules in different files and
// require them here
module.exports = function(app, settings){
    require('./preauth')(app, settings);
    require('./misc/auth')(app, settings);
    require('./shifts')(app, settings);
    require('./users')(app, settings);
    require('./groups')(app, settings);
};
