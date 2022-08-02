const config = require('../entities/Config')
const data = require('../entities/Data')
const { createFlow } = require('../entities/Flow')
const { genLink } = require('../helpers')

const genFlows = (position, networkDescription) => {
  const flows = []
  const flowNamesSet = new Set()

  const inputPortsHashByVl = networkDescription.getPortsHashByVl('I')
  const outputPortsHashByVl = networkDescription.getPortsHashByVl('O')

  config.applications.forEach((app) => {
    const vlsConfig = config.getAppVlsCfg(app)
    const { rows, header } = data.getAppDataByCfg({ position, application: app, config: vlsConfig })
    const vlLinkIndex = header.findIndex((h) => h === vlsConfig.vlLink)
    const vlIdIndex = header.findIndex((h) => h === vlsConfig.id)
    const bagIndex = header.findIndex((h) => h === vlsConfig.bag)
    const maxFrameSizeIndex = header.findIndex((h) => h === vlsConfig.maxFrameSize)

    rows.forEach((vlRow) => {
      const vlLink = vlRow[vlLinkIndex]
      const vlid = vlRow[vlIdIndex]
      const bag = vlRow[bagIndex]
      const maxFrameSize = vlRow[maxFrameSizeIndex]
      const name = `VL_${vlid}`
      const vlOutputPorts = outputPortsHashByVl[vlLink]
      const vlInputPorts = inputPortsHashByVl[vlLink]

      if (flowNamesSet.has(name)) return

      const isLoopVl = vlInputPorts.some(({ device }) => device === 'MDU') && vlOutputPorts.some(({ device }) => device === 'MDU')

      const filteredVlOutputPorts = vlOutputPorts
        .filter((p) => !isLoopVl || p.device === 'MDU') // no need ports on network device if loop
        .filter((p) => p.device === vlOutputPorts[0].device && p.partition === vlOutputPorts[0].partition) // only one app can send to vl

      const filteredVlInputPorts = vlInputPorts
        .filter((p) => !isLoopVl || p.device === 'MDU') // no need ports on network device if loop
        .filter((p) => p.device === vlInputPorts[0].device && p.partition === vlInputPorts[0].partition) // for vl receivers on the same device need one input port

      const flow = createFlow()
      flow.addAttributes({
        name,
        sender: filteredVlOutputPorts.map((p) => genLink(p)).join(` `),
        receivers: filteredVlInputPorts.map((p) => genLink(p)).join(` `),
        vlid,
        maxFrameSize: `${maxFrameSize} byte`,
        bag: networkDescription.getBagLink(bag),
      })

      flows.push(flow)
      flowNamesSet.add(name)
    })
  })

  return flows
}

module.exports = { genFlows }
