const Element = require('../entities/Element')
const config = require('../entities/Config')

class FlowMarker extends Element {
  constructor(name, value) {
    super('flowMarker', { name, value })
  }
}

const createFlowMarker = (name = 'ctMarker') => {
  const value = config.marker || '03:00:00:00'

  return new FlowMarker(name, value)
}

module.exports = { createFlowMarker }
