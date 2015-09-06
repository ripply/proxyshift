module.exports = {
    unauthenticatedUserTriedToAccessProtectedResource: function(req, res) {
        // this could cause a denial of service if it is logged to disk and disk becomes full
        // so do not log this to disk, it might even be best to disable this method in production
        console.log("Unauthenticated user: " + req.ip + " tried to access: " + req.originalUrl);
    }
};
