const Element = require('../entities/Element')
const config = require('../entities/Config')

const createFlowMarker = (name = 'ctMarker') => new Element('flowMarker', { name, value: config.marker })

module.exports = { createFlowMarker }
