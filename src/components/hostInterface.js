const Element = require('../entities/Element')

const createHostInterface = (name = 'ES_PHOST') =>
  new Element('hostInterface', { name, targetId: 'HOST.0' })

module.exports = { createHostInterface }
