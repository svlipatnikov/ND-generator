const Element = require('../entities/Element')

class PhysicalLink extends Element {
  constructor(name, from, to) {
    super('physicalLink', {
      name,
      transmissionSpeed: '100Mbps',
      mediaType: 'copper',
      port: `${from} ${to}`,
      cableLength: '5m',
    })
  }
}

const createPhysicalLink = ({ name, from, to }) => new PhysicalLink(name, from, to)

module.exports = { createPhysicalLink }
