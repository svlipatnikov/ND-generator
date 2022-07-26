const Element = require('../entities/Element')

const createPhysicalLink = ({ name, from, to }) =>
  new Element('physicalLink', {
    name,
    transmissionSpeed: '100Mbps',
    mediaType: 'copper',
    port: `${from} ${to}`,
    cableLength: '5m',
  })

module.exports = { createPhysicalLink }
