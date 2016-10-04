var version = {
    major: 0,
    minor: 9,
    patch: 1
};

var exports = {
    compatible: compatible,
    canUpdateTo: canUpdateTo,
    version: version,
    string: version.major + '.' + version.minor + '.' + version.patch
};

function canUpdateTo(them, sameOk, dis) {
    if (dis === undefined) {
        dis = version;
    }
    if (typeof them == 'string') {
        them = parseVersion(them);
    }
    if (them.major > dis.major) {
        return true;
    } else if (
        them.major == dis.major &&
        them.minor > dis.minor
    ) {
        return true;
    } else if (
        them.major == dis.major &&
        them.minor == dis.minor &&
        them.patch > dis.patch
    ) {
        return true;
    } else if (
        sameOk &&
        them.major == dis.major &&
        them.minor == dis.minor &&
        them.patch == dis.patch
    ) {
        return true;
    } else {
        return false;
    }
}

function compatible(them) {
    return them.major === version.major && them.minor === version.minor;
}

function parseVersion(version) {
    var versions = version.split('.');
    if (versions.length == 3) {
        return {
            major: versions[0],
            minor: versions[1],
            patch: versions[2]
        };
    }
    return {};
}

if (typeof window == 'undefined') {
    module.exports = exports
} else {
    window.ApiVersion = exports;
}
