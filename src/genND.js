const { createDeclaration } = require('./components/declaration')
const { createNetworkDescription } = require('./components/networkDescription')
const { createMetaData } = require('./components/metaData')
const { createDevices } = require('./components/device')
const { createPhysicalLink } = require('./components/physicalLink')
const config = require('./entities/Config')

module.exports.genND = ({ num, position, sheetsData }) => {
  console.log(`Gen Network description file for ${position}...`)

  const declaration = createDeclaration()
  const metaData = createMetaData(position)

  const networkDescription = createNetworkDescription(position)
  networkDescription.addChild(metaData)

  const { deviceSwitch1, deviceSwitch2, deviceNetwork, deviceMDU } = createDevices({ num, position, sheetsData })
  networkDescription.addChild(deviceSwitch1)
  networkDescription.addChild(deviceSwitch2)
  networkDescription.addChild(deviceMDU)
  networkDescription.addChild(deviceNetwork)

  const physicalLink1 = createPhysicalLink({name: 'pLink1', from: deviceMDU.linkPort1 ,to: deviceSwitch1.linkPort1})
  const physicalLink2 = createPhysicalLink({name: 'pLink2', from: deviceMDU.linkPort2 ,to: deviceSwitch2.linkPort1})
  const physicalLink3 = createPhysicalLink({name: 'pLink3', from: deviceNetwork.linkPort1 ,to: deviceSwitch1.linkPort2})
  const physicalLink4 = createPhysicalLink({name: 'pLink4', from: deviceNetwork.linkPort2 ,to: deviceSwitch2.linkPort2})

  networkDescription.addChild(physicalLink1)
  networkDescription.addChild(physicalLink2)
  networkDescription.addChild(physicalLink3)
  networkDescription.addChild(physicalLink4)

  const nd = {
    [declaration.name]: declaration.toObject(),
    [networkDescription.name]: networkDescription.toObject(),
  }

  return nd
}
