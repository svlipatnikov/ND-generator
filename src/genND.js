const { createDeclaration } = require('./entities/Declaration')
const { createNetworkDescription } = require('./entities/NetworkDescription')
const { createMetaData } = require('./entities/MetaData')
const { createFlowMarker } = require('./entities/FlowMarker')
const { createConstraint } = require('./entities/Constraint')

const { createDevices } = require('./generators/genDevices')
const { genPeriods } = require('./generators/genPeriods')
const { genPhysicalLinks } = require('./generators/genPhysicalLinks')
const { genFlows } = require('./generators/genFlows')

const config = require('./entities/Config')
const { genLink } = require('./helpers')

module.exports.genND = (position) => {
  console.log(`Gen Network description file for ${position}...`)

  const enPositionName = config.getPositionCode(position)

  // declaration
  const declaration = createDeclaration()
  const metaData = createMetaData(enPositionName)

  // network description
  const networkDescription = createNetworkDescription(enPositionName)
  networkDescription.addChild(metaData)

  // devices
  const devices = createDevices(position)
  networkDescription.addChildren(Object.values(devices))

  // physical link
  const physicalLinks = genPhysicalLinks(devices)
  networkDescription.addChildren(physicalLinks)

  // bag periods
  const periods = genPeriods(position)
  networkDescription.addChildren(periods)

  // flow (virtual links)
  const flows = genFlows(position, networkDescription)
  networkDescription.addChildren(flows)

  // constraint
  const flowLinks = networkDescription.flowLinks
  const constraint = createConstraint(flowLinks)
  networkDescription.addChild(constraint)

  // flow marker
  const flowMarkerName = 'ctMarker'
  const flowMarker = createFlowMarker(flowMarkerName)
  networkDescription.addChild(flowMarker)
  networkDescription.addAttributes({ ctMarker: genLink({ flowMarker: flowMarkerName }) })

  const nd = {
    [declaration.name]: declaration.toObject(),
    [networkDescription.name]: networkDescription.toObject(),
  }

  return nd
}
