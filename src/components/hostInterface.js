const Element = require('../entities/Element')

const createHostInterface = (name = 'PHOST') =>
  new Element('hostInterface', { name, targetId: 'HOST.0' })

module.exports = { createHostInterface }
