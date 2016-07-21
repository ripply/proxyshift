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
        for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    var nextUpdate;

    // Check > Download > Update
    function check(){
        var nextUpdateTime = nextUpdate;
        if (nextUpdate) {
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

        if (!okToUpdate(nextUpdateTime)) {
            return;
        }

        if (!isWifi()) {
            console.log("Not on wifi, not checking for update.");
            return;
        } else {
            console.log("On WIFI, checking for updates...");
        }

        function doUpdate() {
            loader.download(function onProgress(file) {
                console.log("Downloaded: " + file);
            })
                .then(function(){
                    return loader.update();
                },function(err){
                    console.error('Auto-update error:',err);
                });
        }

        var days = 1;
        var hours = 24;
        var minutes = 60;
        var seconds = 60;
        nextUpdate = getNow() + (days * hours * minutes * seconds);
        if (hasStorage) {
            localStorage.setItem('next_update_time', nextUpdate);
        }

        loader.check()
            .then(function(newManifest){
                var manifestHash = stringHashcode(JSON.stringify(newManifest));
                if (isCordova) {
                    function updateIgnored(manifestHash) {
                        nextUpdate = getNow() + ((days / 2) * hours * minutes * seconds);
                        if (hasStorage) {
                            localStorage.setItem('ignore_update', '' + manifestHash);
                            localStorage.setItem('next_update_time', '' + nextUpdate);
                        }
                    }

                    if (hasStorage) {
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
                        navigator.notification.prompt(
                            'There is an update available!',
                            function updatePromptCallback(buttonClicked) {
                                if (buttonClicked == 0) {
                                    doUpdate();
                                } else if (buttonClicked == 1) {
                                    // do nothing
                                } else if (buttonClicked == 2) {
                                    updateIgnored(manifestHash);
                                }
                                if (hasStorage) {
                                    localStorage.setItem('next_update_time', '' + nextUpdate);
                                }
                            },
                            'Update Available',
                            buttonLabels
                        );
                    } else {
                        doUpdate();
                    }
                } else {
                    doUpdate();
                }
            });
    }

    // Couple events:

    // 1. On launch
    check();

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
