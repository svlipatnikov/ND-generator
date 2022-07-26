const Element = require('../entities/Element')

const createConstraint = (flows) =>
  new Element('constraint', {
    'xsi:type': 'c:FullRedundancyConstraint',
    name: 'FullRedundancyConstraint',
    redundancyLevel: '2',
    flows,
  })

module.exports = { createConstraint }
