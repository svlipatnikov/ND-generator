const Element = require('../entities/Element')

class Port extends Element {
  constructor(attributes) {
    super('port', attributes)
  }
}

const createPort = (attributes) => new Port(attributes)

module.exports = { createPort }
