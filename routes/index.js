// Divide all of your modules in different files and
// require them here
module.exports = function(app, settings){
    require('./preauth')(app, settings);
    require('./misc/auth')(app, settings);
};
