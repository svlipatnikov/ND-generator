const Element = require('../entities/Element')

const createPort = (attributes) => new Element('port', attributes)

module.exports = { createPort }
