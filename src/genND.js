const { createDeclaration } = require('./components/declaration')
const { createNetworkDescription } = require('./components/networkDescription')
const { createMetaData } = require('./components/metaData')
const { createDevices } = require('./components/device')
const { createPhysicalLink } = require('./components/physicalLink')
const { createPeriods } = require('./components/period')
const { createFlowMarker } = require('./components/flowMarker')
const { createConstraint } = require('./components/constraint')

const config = require('./entities/Config')
const data = require('./entities/Data')
const { getAppDataByCfg, genLink } = require('./helpers')
const { createFlow } = require('./components/flow')



module.exports.genND = ( position ) => {
  console.log(`Gen Network description file for ${position}...`)

  const enPositionName = config.getEnPositionName(position)

  // declaration
  const declaration = createDeclaration()
  const metaData = createMetaData(enPositionName)

  // network description
  const networkDescription = createNetworkDescription(enPositionName)
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
  const periods = createPeriods(position)
  periods.forEach((period) => networkDescription.addChild(period))

  // flow (virtual links)
  const inputPortsHashByVl = networkDescription.getPortsHashByVl('I')
  const outputPortsHashByVl = networkDescription.getPortsHashByVl('O')

  config.applications.forEach((app) => {
    const appSheets = data.getAppSheets(app)
    const vlsConfig = config.getAppVls(app)

    const { rows, header } = getAppDataByCfg({ position, appSheets, config: vlsConfig })
    const vlLinkIndex = header.findIndex((h) => h === vlsConfig.vlLink)
    const vlIdIndex = header.findIndex((h) => h === vlsConfig.id)
    const bagIndex = header.findIndex((h) => h === vlsConfig.bag)
    const maxFrameSizeIndex = header.findIndex((h) => h === vlsConfig.maxFrameSize)

    rows.forEach((vlRow) => {
      try {
        const vlLink = vlRow[vlLinkIndex]
        const vlid = vlRow[vlIdIndex]
        const bag = vlRow[bagIndex]
        const maxFrameSize = vlRow[maxFrameSizeIndex]
        const name = `VL_${vlid}`
        const vlInputPorts = inputPortsHashByVl[vlLink]
        const vlOutputPorts = outputPortsHashByVl[vlLink]

        if (networkDescription.flowNamesSet.has(name)) return

        const isLoopVl = vlInputPorts.some(({ device }) => device === 'MDU') && vlOutputPorts.some(({ device }) => device === 'MDU')

        const filteredVlOutputPorts = vlOutputPorts
          .filter((p) => !isLoopVl || p.device === 'MDU') // filter if loop
          .filter((p) => p.device === vlOutputPorts[0].device && p.partition === vlOutputPorts[0].partition)

        const filteredVlInputPorts = vlInputPorts
          .filter((p) => !isLoopVl || p.device === 'MDU') // filter if loop
          .filter((p) => p.device === vlInputPorts[0].device && p.partition === vlInputPorts[0].partition) // filter input port if vl receives more then one app in the same device

        const flow = createFlow()
        flow.addAttributes({
          name,
          sender: filteredVlOutputPorts.map((p) => genLink(p)).join(` `),
          receivers: filteredVlInputPorts.map((p) => genLink(p)).join(` `),
          vlid,
          maxFrameSize: `${maxFrameSize} byte`,
          bag: networkDescription.getBagLink(bag),
        })
        networkDescription.addChild(flow)
      } catch (err) {}
    })
  })

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
