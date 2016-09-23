// identify what client build the user has so that we can prompt them to update if an auto update requires an update
window.CordovaApiVersion = window.ApiVersion;
window.CordovaApiVersion.build = 1;
window.CordovaApiVersion.isCordovaVersionHigher = function() {
    return window.ApiVersion.canUpdateTo(window.CordovaApiVersion.version, false);
};
