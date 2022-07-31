const { genLink } = require('../helpers')
const Element = require('./Element')

class NetworkDescription extends Element {
  constructor(name) {
    super('nd:NetworkDescription', {
      'xmi:version': '2.0',
      'xmlns:xmi': 'http://www.omg.org/XMI',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:buf': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/Buffering/5.2.0',
      'xmlns:c': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/Constraint/5.2.0',
      'xmlns:flows': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/Flows/5.2.0',
      'xmlns:logical': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/Logical/5.2.0',
      'xmlns:nd': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/5.2.0',
      'xmlns:sync': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/Synchronization/5.2.0',
      'xmlns:topo': 'http://www.tttech.com/Schema/TTEthernet/Network_Description/Topology/5.2.0',
      name,
      enableDynamicRouting: 'false',
      createUnknownDefaultRoutes: 'false',
    })
  }

  get flowNamesSet() {
    return new Set(this.children.filter((child) => child.name === 'flow').map((flow) => flow.attributes.name))
  }

  get flowLinks() {
    return [...this.flowNamesSet].map((name) => genLink({ flow: name })).join(` `)
  }

  getBagLink(bagValue) {
    const bagElement = this.children.find((child) => child.name === 'period' && child.value === bagValue)
    return genLink({ period: bagElement.attributes.name })
  }

  getPortsHashByVl(direction) {
    const hash = {}

    const devices = this.children.filter((child) => child.name === 'device')
    devices.forEach((deviceElement) => {
      const device = deviceElement.attributes.name
      deviceElement.children
        .filter((c) => c.name === 'partition')
        .forEach((partitionElement) => {
          const partition = partitionElement.attributes.name
          partitionElement.children.forEach((dataPortElement) => {
            const dataPort = dataPortElement.attributes.name
            const vlLink = dataPortElement.vlLink
            if (dataPortElement.io === direction) {
              const portLinkInfo = { device, partition, dataPort }
              if (hash[vlLink]) hash[vlLink].push(portLinkInfo)
              else hash[vlLink] = [portLinkInfo]
            }
          })
        })
    })

    return hash
  }
}

const createNetworkDescription = (position) => {
  const name = `AFDX_CONFIG_${position}`
  return new NetworkDescription(name)
}

module.exports = { NetworkDescription, createNetworkDescription }
