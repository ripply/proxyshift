var config = require('config');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var smtpConfig;
var smtpTransport;
if (config.has('google.api.gmail.client_id')) {
    var user = config.get('google.api.gmail.user');
    var client_id = config.get('google.api.gmail.client_id');
    var client_secret = config.get('google.api.gmail.client_secret');
    var refresh_token = config.get('google.api.gmail.refresh_token');
    var access_token = config.get('google.api.gmail.access_token');

    smtpConfig = {
        user: user,
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refresh_token,
        access_token: access_token,
        access_timeout: 5000
    };

    smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            XOAuth2: xoauth2.createXOAuth2Generator({
                user: smtpConfig.user,
                clientId: smtpConfig.client_id,
                clientSecret: smtpConfig.client_secret,
                refreshToken: smtpConfig.refresh_token,
                accessToken: smtpConfig.access_token,
                timeout: smtpConfig.access_timeout - Date.now()
            })
        }
    });
} else if (config.has('google.api.gmail.pass')) {
    var user = config.get('google.api.gmail.user');
    var pass = config.get('google.api.gmail.pass');

    smtpConfig = {
        user: user,
        pass: pass
    };

    smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: smtpConfig
    });
}

console.log(smtpConfig);

module.exports = smtpTransport;

/*
var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuthStrategy,
    config = require('config');

passport.use('google-imap', new GoogleStrategy({
  clientID: config.get('google.api.gmail.clientid'),
  clientSecret: config.get('google.api.gmail.clientsecret')
}, function (accessToken, refreshToken, profile, done) {
    console.log("?!?!?!?!");
  console.log(accessToken, refreshToken, profile);
  done(null, {
    access_token: accessToken,
    refresh_token: refreshToken,
    profile: profile
  });
}));

exports.mount = function (app) {
  app.get('/add-imap/:address?', function (req, res, next) {
    passport.authorize('google-imap', {
        scope: [
          'https://mail.google.com/',
          'https://www.googleapis.com/auth/userinfo.email'
        ],
        callbackURL: config('web.vhost') + '/add-imap',
        accessType: 'offline',
        approvalPrompt: 'force',
        loginHint: req.params.address
      })(req, res, function () {
        res.send(req.user);
      });
  });
};
*/
