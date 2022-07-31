const Element = require('../entities/Element')

class HostInterface extends Element {
  constructor(name) {
    super('hostInterface', { name, targetId: 'HOST.0' })
  }
}

const createHostInterface = (name = 'PHOST') => new HostInterface(name)

module.exports = { createHostInterface }
