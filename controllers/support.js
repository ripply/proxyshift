var models = require('../app/models'),
    updateModel = require('./controllerCommon').updateModel,
    _ = require('underscore'),
    config = require('config'),
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    getModelKeys = require('./controllerCommon').getModelKeys,
    clientCreate = require('./controllerCommon').clientCreate,
    clientError = require('./controllerCommon').clientError,
    getPatchKeysWithoutBannedKeys = require('./controllerCommon').getPatchKeysWithoutBannedKeys,
    createSelectQueryForAllColumns = require('./controllerCommon').createSelectQueryForAllColumns,
    error = require('./controllerCommon').error,
    controllerCommon = require('./controllerCommon'),
    time = require('../app/time'),
    utils = require('../app/utils'),
    appLogic = require('../app'),
    variables = require('./variables'),
    apiversion = require('../ionic/www/js/shared/ApiVersion.js'),
    slack = require('../app/slack.js'),
    Bookshelf = models.Bookshelf;

module.exports = {
    route: '/api/v1/support',
    '/inquiry': {
        'post': { // get info about your account
            // auth: // anyone logged in
            route: function (req, res) {
                res.sendStatus(200);
                var supportMessage = "\nUSER: " + req.user.id +
                    ' ' + req.user.get('username') +
                    ' ' + req.user.get('email') +
                    "\nUserAgent: " + req.body.userAgent +
                    "\nMESSAGE: '" + req.body.message + "'";
                console.log("Support inquiry: " + supportMessage);
                slack.info(
                    supportMessage,
                    '#support'
                );
            }
        }
    }
};
