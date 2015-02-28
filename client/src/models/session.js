var Backbone = require('backbone');
var UserModel = require('./user_model');

module.exports = SessionModel = Backbone.Model.extend({

    // Initialize with negative/empty defaults
    // These will be overriden after the initial checkAuth
    defaults: {
        logged_in: null,
        id: ''
    },

    initialize: function(){
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        // Singleton user object
        // Access or listen on this throughout any module with app.session.user
        this.user = new UserModel({});

        var url = $(location).attr('href');
        // https://gist.github.com/alanhamlett/6316427
        console.log('Setting up ajaxSetup');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (settings.type == 'POST' || settings.type == 'PUT' || settings.type == 'DELETE') {
                    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                        // Only send the token to relative URLs i.e. locally.
                        console.log('setting header');
                        xhr.setRequestHeader("x-csrf-token", $.cookie('csrftoken'));
                    }
                }
            }
        });
    },

    //urlRoot: 'session',

    url: function(){
        return 'session';
    },

    // Fxn to update user attributes after recieving API response
    updateSessionUser: function( userData ){
        //this.user.set(_.pick(userData, _.keys(this.user.defaults)));
    },

    checkAuthCache: {
        result: null,
        needs_update: true
    },

    invalidateAuthCache: function() {
        this.checkAuthCache.needs_update = true;
        this.checkAuthCache.result = null;
    },

    updateAuthCache: function(result) {
        this.checkAuthCache.needs_update = (result === null);
        this.checkAuthCache.result = result;
        return result;
    },

    authCacheInvalid: function() {
        return this.checkAuthCache.needs_update;
    },

    setLoggedIn: function(logged_in) {
        this.set({logged_in: logged_in});
    },

    /*
     * Check for session from API
     * The API will parse client cookies using its secret token
     * and return a user object if authenticated
     */
    checkAuth: function(callback, args) {
        var self = this;
        //TODO: This needs a timeout value
        var updateAuthCache = this.updateAuthCache;
        var checkAuthCache = this.checkAuthCache;
        if (checkAuthCache.needs_update) {
            if (this.get('logged_in')) {
                return updateAuthCache(function(callback) {
                    return callback.success();
                })(callback);
            } else {
                this.fetch({
                    success: function (mod, res) {
                        if (!res.error) {
                            //self.updateSessionUser(res.user);
                            self.setLoggedIn(true);
                            if ('success' in callback) {
                                updateAuthCache(function (callback) {
                                    callback.success(mod, res);
                                })(callback);
                            }
                        } else {
                            self.set({logged_in: false});
                            if ('error' in callback) {
                                updateAuthCache(function (callback) {
                                    callback.error(mod, res);
                                })(callback);
                            }
                        }
                    }, error: function (mod, res) {
                        self.setLoggedIn(false);
                        if ('error' in callback) {
                            updateAuthCache(function (callback) {
                                callback.error(mod, res);
                            })(callback);
                        }
                    }
                }).complete(function () {
                    if ('complete' in callback) {
                        updateAuthCache(function (callback) {
                            callback.complete();
                        })(callback);
                    }
                });
            }
        } else {
            checkAuthCache.result(callback);
        }
    },


    /*
     * Abstracted fxn to make a POST request to the auth endpoint
     * This takes care of the CSRF header for security, as well as
     * updating the user and session after receiving an API response
     */
    postAuth: function(opts, callback, args){
        var self = this;
        var postData = _.omit(opts, 'method');
        $.ajax({
            url: this.url() + '/' + opts.method,
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify( postData ),
            success: function(res, textStatus, xhr){
                if( !res.error ){
                    if(_.indexOf(['login', 'signup'], opts.method) !== -1){
                        self.updateSessionUser( res || {} );
                        self.setLoggedIn(true);
                        self.set({ id: res.id, logged_in: true });
                    } else {
                        self.loggedOut();
                    }

                    if(callback && 'success' in callback) callback.success(res);
                } else {
                    if(callback && 'error' in callback) callback.error(res, textStatus);
                }
            },
            error: function(mod, res, errorThrown){
                if(callback && 'error' in callback) callback.error(res, errorThrown);
            }
        }).complete( function(){
            if(callback && 'complete' in callback) callback.complete(res);
        });
    },

    loggedIn: function(next) {
        this.checkAuth(next);
    },

    loggedOut: function() {
        this.invalidateAuthCache();
        this.setLoggedIn(false);
    },

    userId: function() {
        return this.defaults.user_id;
    },

    login: function(opts, callback, args){
        this.invalidateAuthCache();
        this.postAuth(_.extend(opts, { method: 'login' }), callback);
    },

    logout: function(opts, callback, args){
        this.invalidateAuthCache();
        this.postAuth(_.extend(opts, { method: 'logout' }), callback);
    },

    signup: function(opts, callback, args){
        this.invalidateAuthCache();
        this.postAuth(_.extend(opts, { method: 'signup' }), callback);
    },

    removeAccount: function(opts, callback, args){
        this.invalidateAuthCache();
        this.postAuth(_.extend(opts, { method: 'remove_account' }), callback);
    }

});