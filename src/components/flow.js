const Element = require('../entities/Element')
const config = require('../entities/Config')

const createFlow = () =>
  new Element('flow', {
    'xsi:type': 'flows:RCVirtualLink',
    redundancyMgmt: 'rc_redundancy',
    jitter: config.defaultJitter || '0 ms',
  })

module.exports = { createFlow }
