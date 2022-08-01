const { createPhysicalLink } = require('../entities/PhysicalLink')

const genPhysicalLinks = (devices) => {
  const { deviceMDU, deviceNetwork, deviceSwitch1, deviceSwitch2 } = devices

  const physicalLink1 = createPhysicalLink({ name: 'pLink1', from: deviceMDU.linkPort1, to: deviceSwitch1.linkPort1 })
  const physicalLink2 = createPhysicalLink({ name: 'pLink2', from: deviceMDU.linkPort2, to: deviceSwitch2.linkPort1 })
  const physicalLink3 = createPhysicalLink({ name: 'pLink3', from: deviceNetwork.linkPort1, to: deviceSwitch1.linkPort2 })
  const physicalLink4 = createPhysicalLink({ name: 'pLink4', from: deviceNetwork.linkPort2, to: deviceSwitch2.linkPort2 })

  return [physicalLink1, physicalLink2, physicalLink3, physicalLink4]
}

module.exports = { genPhysicalLinks }
