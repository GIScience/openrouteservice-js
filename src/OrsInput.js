OrsInput = function(input, input2) {
    this.set(input, input2);
};

OrsInput.prototype.round = function(val, precision) {
    if (precision === undefined) precision = 1e6;
    return Math.round(val * precision) / precision;
};

OrsInput.prototype.setCoord = function(lat, lng) {
    this.coord = [this.round(lat), this.round(lng)];
};

OrsInput.isObject = function(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue.toLowerCase() === "[object object]";
};

OrsInput.isString = function(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue.toLowerCase() === "[object string]";
};

OrsInput.prototype.set = function(strOrObject, input2) {
    if (input2) {
        this.setCoord(strOrObject, input2);
        return;
    }

    if (OrsInput.isObject(strOrObject)) {
        this.setCoord(strOrObject.lat, strOrObject.lng);
    } else if (OrsInput.isString(strOrObject)) {
        var index = strOrObject.indexOf(",");
        if (index >= 0) {
            this.coord = [
                this.round(parseFloat(strOrObject.substr(0, index))),
                this.round(parseFloat(strOrObject.substr(index + 1)))
            ];
        }
    }
};

OrsInput.prototype.toString = function() {
    if (this.lat !== undefined && this.lng !== undefined)
        return this.lat + "," + this.lng;
    return undefined;
};

module.exports = OrsInput;
