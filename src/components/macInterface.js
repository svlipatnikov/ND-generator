const Element = require('../entities/Element')

const createMacInterface = (name = 'ES_MAC', address = '02:00:00:00:00:00') =>
  new Element('macInterface', { name, address })

module.exports = { createMacInterface }
