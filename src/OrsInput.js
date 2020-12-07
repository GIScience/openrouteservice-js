class OrsInput {
  constructor(input, input2) {
    this.setCoord(input, input2)
  }

  round(val, precision) {
    if (precision === undefined) precision = 1e6
    return Math.round(val * precision) / precision
  }

  setCoord(lat, lng) {
    this.coord = [this.round(lat), this.round(lng)]
  }

  isObject(value) {
    var stringValue = Object.prototype.toString.call(value)
    return stringValue.toLowerCase() === '[object object]'
  }

  isString(value) {
    var stringValue = Object.prototype.toString.call(value)
    return stringValue.toLowerCase() === '[object string]'
  }

  set(strOrObject, input2) {
    if (input2) {
      this.setCoord(strOrObject, input2)
      return
    }

    if (OrsInput.isObject(strOrObject)) {
      this.setCoord(strOrObject.lat, strOrObject.lng)
    } else if (OrsInput.isString(strOrObject)) {
      var index = strOrObject.indexOf(',')
      if (index >= 0) {
        this.coord = [
          this.round(parseFloat(strOrObject.substr(0, index))),
          this.round(parseFloat(strOrObject.substr(index + 1)))
        ]
      }
    }
  }

  toString() {
    if (this.lat !== undefined && this.lng !== undefined) {
      return this.lat + ',' + this.lng
    }
    return undefined
  }
}

export default OrsInput
