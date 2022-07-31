const Element = require('../entities/Element')

const config = require('../entities/Config')

class Flow extends Element {
  constructor(jitter) {
    super('flow', {
      'xsi:type': 'flows:RCVirtualLink',
      redundancyMgmt: 'rc_redundancy',
      jitter,
    })
  }
}

const createFlow = () => {
  const jitter = config.defaultJitter || '0 ms'

  return new Flow(jitter)
}

module.exports = { Flow, createFlow }
