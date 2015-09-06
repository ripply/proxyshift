module.exports = {
    nowInUtc: function() {
        return Math.floor(new Date().getTime()/1000);
    },
    // threshold to reject client requests as client time being too different from server time
    deltaDifferenceThreshold: 1800 // 30mins
};
