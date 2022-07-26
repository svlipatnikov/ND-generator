const Element = require('../entities/Element')
const NetworkDescription = require('../entities/NetworkDescription')

const createNetworkDescription = (position) => {
  const name = `AFDX_CONFIG_${position}`
  return new NetworkDescription(name)
}

module.exports = { createNetworkDescription }
