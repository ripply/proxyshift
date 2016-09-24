window.onerror = function(msg, file, line, col, error) {
    console.error(error);
    // send to server if user has not opted out
    var sendError = true;
    if (typeof(Storage) !== "undefined") {
        var reportErrors = localStorage.getItem('reportErrors');
        sendError = (reportErrors === undefined || reportErrors === null || reportErrors === true);
    }
    if (sendError) {
        var ERROR_REPORT = "https://www.proxyshift.com/api/v1/errorreport";
        var message = JSON.stringify({
            message: error.toString(),
            version: window.ApiVersion.string,
            browser: navigator.appVersion
        });
        StackTrace
            .fromError(error)
            .then(function onError(stackframes) {
                StackTrace.report(stackframes, ERROR_REPORT, message);
            })
            .catch(function errCallback(stackError) {
                message.message = stackError.toString();
                StackTrace
                    .fromError(stackError)
                    .then(function (errorstackframes) {
                        StackTrace.report(errorstackframes, ERROR_REPORT, message);
                    })
                    .catch(function (finalStackError) {
                        console.error(finalStackError);
                    });
            });
    }
    return false;
};
