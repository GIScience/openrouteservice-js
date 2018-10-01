var OrsUtil = function() {};

OrsUtil.prototype.clone = function(obj) {
    var newObj = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
};

OrsUtil.prototype.copyProperties = function(args, argsInto) {
    if (!args) return argsInto;

    for (var prop in args) {
        if (args.hasOwnProperty(prop) && args[prop] !== undefined) {
            argsInto[prop] = args[prop];
        }
    }
    console.log(argsInto)
    return argsInto;
};


OrsUtil.prototype.extractError = function(res, url) {
    var msg;

    if (res && res.body) {
        msg = res.body;
        if (msg.message) msg = msg.message;
    } else {
        msg = res;
    }

    return new Error(msg + " - for url " + url);
};

OrsUtil.prototype.isArray = function(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue.toLowerCase() === "[object array]";
};

OrsUtil.prototype.isObject = function(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue.toLowerCase() === "[object object]";
};

OrsUtil.prototype.isString = function(value) {
    return typeof value === "string";
};

module.exports = OrsUtil;
