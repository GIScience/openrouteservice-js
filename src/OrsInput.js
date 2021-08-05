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
}

export default OrsInput
