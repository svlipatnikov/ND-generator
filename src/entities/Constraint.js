const Element = require('../entities/Element')

class Constraint extends Element {
  constructor() {
    super('constraint', {
      'xsi:type': 'c:FullRedundancyConstraint',
      name: 'FullRedundancyConstraint',
      redundancyLevel: '2',
    })
  }
}

const createConstraint = (flows) => {
  const constraint = new Constraint()
  constraint.addAttributes({ flows })
  return constraint
}

module.exports = { createConstraint }
