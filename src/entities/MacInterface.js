const Element = require('../entities/Element')

class MacInterface extends Element {
  constructor(name, address) {
    super('macInterface', { name, address })
  }
}

const createMacInterface = (name = 'MAC', address = '02:00:00:00:00:00') => new MacInterface(name, address)

module.exports = { createMacInterface }
