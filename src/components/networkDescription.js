const Element = require('../entities/Element')

const createNetworkDescription = (position, ctMarker = 'ctMarker') => {
  return new Element('nd:NetworkDescription', {
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
    name: `AFDX_CONFIG_${position}`,
    enableDynamicRouting: 'false',
    createUnknownDefaultRoutes: 'false',
    ctMarker: `//@flowMarker[name='${ctMarker}']`,
  })
}

module.exports = { createNetworkDescription }
