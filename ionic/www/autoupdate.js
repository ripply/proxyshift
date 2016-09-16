(function(){
    // Check for Cordova
    var isCordova = typeof cordova !== 'undefined',
        hasCordovaDialogs = typeof navigator.notification !== 'undefined',
    // CordovaPromiseFS
        fs,
    // CordovaFileLoader
        loader,
    // script-tag...
        script,
    // ...that contains the serverRoot
        serverRoot;

    function getConnection() {
        if (isCordova) {
            return navigator.connection.type;
        }
    }

    function isWifi() {
        var connection = getConnection();
        try {
            return connection == Connection.WIFI || connection == undefined;
        } catch (err) {
            // do nothing
        }
    }

    // Get serverRoot from script tag.
    script = document.querySelector('script[server]');
    if(script) serverRoot= script.getAttribute('server');
    if(!serverRoot) {
        throw new Error('Add a "server" attribute to the bootstrap.js script!');
    }

    // Initialize filesystem and loader
    fs = new CordovaPromiseFS({
        persistent: isCordova, // Chrome should use temporary storage.
        Promise: Promise
    });

    loader = new CordovaAppLoader({
        fs: fs,
        localRoot: 'app',
        serverRoot: serverRoot,
        mode: 'mirror',
        cacheBuster: true
    });

    function getNow() {
        return new Date().getTime();
    }

    function okToUpdate(next) {
        if (next) {
            return next <= getNow();
        } else {
            return true;
        }
    }

    function stringHashcode(string) {
        var hash = 0, i, chr, len;
        if (this.length === 0) return hash;
        for (i = 0, len = string.length; i < len; i++) {
            chr   = string.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    var nextUpdate;

    window.checkForUpdate = function checkForUpdate() {
        check(true);
    };

    window.checkForUpdatesSetting = function checkForUpdatesSetting(newSetting) {
        if (typeof(Storage) !== "undefined") {
            if (newSetting !== undefined) {
                localStorage.setItem('check_for_updates', newSetting == true);
            } else {
                var checkForUpdates = localStorage.getItem('check_for_updates');
                if (checkForUpdates == true || checkForUpdates == undefined || checkForUpdates == null) {
                    return true;
                }
            }
        }
        return false;
    };

    function localStorageAvailable() {
        return typeof(Storage) !== "undefined";
    }

    function isForceUpdateRequired() {
        return localStorageAvailable() && localStorage.getItem('initial_update') != true;
    }

    function initialUpdateComplete() {
        if (localStorageAvailable()) {
            localStorage.setItem('initial_update', true);
        }
    }

    var checking = false;

    // Check > Download > Update
    function check(force){
        if (checking) {
            return;
        }
        if (
            window.location.href.indexOf('com.ionic.viewapp') >= 0 || // android
            window.location.href.indexOf('Library/NoCloud/files//') >= 0 // ios
        ) {
            // ionic view does not support auto updating
            return;
        }
        var nextUpdateTime = nextUpdate;
        if (!force && nextUpdate) {
            if (okToUpdate(nextUpdate)) {
                // ok, try updating
            } else {
                // too early, don't bother hitting local storage
                return
            }
        }
        var hasStorage = false;
        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            hasStorage = true;
            nextUpdateTime = localStorage.getItem('next_update_time');
            var checkForUpdates = localStorage.getItem('check_for_updates');
            if (!force && checkForUpdates == false) {
                return;
            }
            if (nextUpdateTime !== undefined &&
                nextUpdateTime !== null) {
                try {
                    nextUpdateTime = parseInt(nextUpdateTime);
                } catch (err) {
                    nextUpdateTime = undefined;
                }
            }
        } else {
            // Sorry! No Web Storage support..
        }

        if (!force && !okToUpdate(nextUpdateTime)) {
            return;
        }

        if (!force && !isWifi()) {
            console.log("Not on wifi, not checking for update.");
            return;
        } else {
            console.log("On WIFI, checking for updates...");
        }

        function doUpdate(reload) {
            loader.download(function onProgress(file) {
                console.log("Downloaded: " + file);
            })
                .then(function(){
                    if (localStorageAvailable()) {
                        if (isForceUpdateRequired()) {
                            initialUpdateComplete();
                        }
                    }
                    return loader.update(reload);
                },function(err){
                    console.error('Auto-update error:',err);
                });
        }

        var days = 1;
        var hours = 24;
        var minutes = 60;
        var seconds = 60;
        var fromNow = days * hours * minutes * seconds;

        // check for updates more frequently in 'alpha'
        var alphaStart = 1466467200;
        var alphaEnd = 1474416000;
        var alphaLength = alphaEnd - alphaStart;

        var now = getNow();

        var start = Math.max(alphaStart, now);
        var alphaTime = alphaEnd - start;

        if (alphaTime < 0) {
            // alpha is over, do nothing
        } else {
            // alpha in progress, shorten check interval based on how far we are into it
            var alphaProgress = alphaTime / alphaLength;
            console.log('Shortening update check interval to ' + alphaProgress + '%');
            fromNow = fromNow * alphaProgress;
        }

        nextUpdate = now + fromNow;
        if (hasStorage) {
            localStorage.setItem('next_update_time', nextUpdate);
        }

        checking = true;

        loader.check()
            .then(function(updatable){
                if (!updatable) {
                    if (!isForceUpdateRequired()) {
                        initialUpdateComplete();
                    }
                    return;
                }
                var newManifest = loader.newManifest;
                checking = false;
                try {
                    var manifestHash = stringHashcode(JSON.stringify(newManifest));
                    if (isCordova) {
                        function updateIgnored(manifestHash) {
                            nextUpdate = now + fromNow / 2;
                            if (hasStorage) {
                                localStorage.setItem('ignore_update', '' + manifestHash);
                                localStorage.setItem('next_update_time', '' + nextUpdate);
                            }
                        }

                        if (!force && hasStorage) {
                            var ignoredManifestHash = localStorage.getItem('ignore_update');
                            if (ignoredManifestHash == manifestHash) {
                                if (hasStorage) {
                                    updateIgnored(manifestHash);
                                }
                                return;
                            }
                        }
                        var buttonLabels = [
                            'Update',
                            'Maybe Later'
                        ];
                        if (hasStorage) {
                            buttonLabels.push('Ignore');
                        }
                        if (hasCordovaDialogs) {
                            if (!isForceUpdateRequired()) {
                                doUpdate(true);
                            } else {
                                navigator.notification.confirm(
                                    'There is an update available!',
                                    function updatePromptCallback(buttonClicked) {
                                        if (buttonClicked == 1) {
                                            doUpdate();
                                        } else if (buttonClicked == 2) {
                                            // do nothing
                                        } else if (buttonClicked == 3) {
                                            updateIgnored(manifestHash);
                                        }
                                        if (hasStorage) {
                                            localStorage.setItem('next_update_time', '' + nextUpdate);
                                        }
                                    },
                                    'Update Available',
                                    buttonLabels
                                );
                            }
                        } else {
                            doUpdate();
                        }
                    } else {
                        doUpdate();
                    }
                } catch (err) {
                    var error = 'An error occurred while trying to update';
                    if (hasCordovaDialogs) {
                        navigator.notification.alert(error);
                    } else {
                        alert(error);
                    }
                }
            })
            .catch(function(err) {
                checking = false;
            })
    }

    // Couple events:

    // 1. On launch
    check(!isForceUpdateRequired());

    // 2. Cordova: On resume
    fs.deviceready.then(function(){
        document.addEventListener('resume', check);
    });

    // 3. Chrome: On page becomes visible again
    function handleVisibilityChange() {
        if (!document.webkitHidden) {
            check();
        }
    }
    document.addEventListener("webkitvisibilitychange", handleVisibilityChange, false);
})();
