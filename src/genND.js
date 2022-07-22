const { createDeclaration } = require('./components/declaration')
const { createNetworkDescription } = require('./components/networkDescription')
const { createMetaData } = require('./components/metaData')
const { createDevices } = require('./components/device')
const { createPhysicalLink } = require('./components/physicalLink')
const { createPeriods } = require('./components/period')

// const config = require('./entities/Config')

module.exports.genND = ({ position }) => {
  console.log(`Gen Network description file for ${position}...`)

  // declaration
  const declaration = createDeclaration()
  const metaData = createMetaData(position)

  // network description
  const networkDescription = createNetworkDescription(position)
  networkDescription.addChild(metaData)

  // devices
  const { deviceSwitch1, deviceSwitch2, deviceNetwork, deviceMDU } = createDevices(position)
  networkDescription.addChild(deviceSwitch1)
  networkDescription.addChild(deviceSwitch2)
  networkDescription.addChild(deviceMDU)
  networkDescription.addChild(deviceNetwork)

  // physical link
  const physicalLink1 = createPhysicalLink({ name: 'pLink1', from: deviceMDU.linkPort1, to: deviceSwitch1.linkPort1 })
  const physicalLink2 = createPhysicalLink({ name: 'pLink2', from: deviceMDU.linkPort2, to: deviceSwitch2.linkPort1 })
  const physicalLink3 = createPhysicalLink({ name: 'pLink3', from: deviceNetwork.linkPort1, to: deviceSwitch1.linkPort2 })
  const physicalLink4 = createPhysicalLink({ name: 'pLink4', from: deviceNetwork.linkPort2, to: deviceSwitch2.linkPort2 })

  networkDescription.addChild(physicalLink1)
  networkDescription.addChild(physicalLink2)
  networkDescription.addChild(physicalLink3)
  networkDescription.addChild(physicalLink4)

  // bag periods
  const periods = createPeriods()
  periods.forEach((period) => networkDescription.addChild(period))

  const nd = {
    [declaration.name]: declaration.toObject(),
    [networkDescription.name]: networkDescription.toObject(),
  }

  return nd
}
