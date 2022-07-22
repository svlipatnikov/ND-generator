const Element = require('../entities/Element')
const config = require('../entities/Config')

const createPeriod = (time) => new Element('period', { name: `BAG_${time}`, time: `${time} ms` })

const createPeriods = ( sheetsData ) => {
  const bags = new Set()
  config.applications.forEach((app) => {
    // TODO read all vls for each app and get its bag
  })

  const periods = []
  bags.forEach((bag) => periods.push(createPeriod(bag)))

  return periods
}

module.exports = {createPeriods}