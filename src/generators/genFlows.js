const config = require('../entities/Config')
const data = require('../entities/Data')
const { getAppDataByCfg } = require('../helpers')

const genFlows = (position, networkDescription) => {
  const flows = []
  const flowNamesSet = new Set()

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

        if (flowNamesSet.has(name)) return

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

        flows.push(flow)
        flowNamesSet.add(name)

      } catch (err) {}
    })
  })

  return flows
}

module.exports = { genFlows }
