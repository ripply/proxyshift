var version = {
    major: 0,
    minor: 0,
    patch: 1
};

var exports = {
    compatible: compatible,
    version: version,
    string: version.major + '.' + version.minor + '.' + version.patch
};

function compatible(them) {
    return them.major === version.major && them.minor === version.minor;
}

if (typeof window == 'undefined') {
    module.exports = exports
} else {
    window.ApiVersion = exports;
}
