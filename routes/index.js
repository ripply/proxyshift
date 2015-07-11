var ConnectRoles = require('connect-roles'),
    roles = new ConnectRoles(require('./misc/rolesOptions'));

// Divide all of your modules in different files and
// require them here
module.exports = function(app, settings){
    require('./preauth')(app, settings);
    require('./misc/auth')(app, settings);
    require('./misc/roles')(app, roles);
    require('./shifts')(app, settings);
    require('./categories')(app, settings);
    require('./users')(app, settings);
    require('./groups')(app, settings);
};