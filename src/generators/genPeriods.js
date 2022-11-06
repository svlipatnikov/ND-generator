const { createPeriod } = require('../entities/Period')
const config = require('../entities/Config')
const data = require('../entities/Data')
const { bagOptimizer } = require('../helpers')

const genPeriods = (position) => {
  const bags = new Set()
  
  config.applications.forEach((app) => {
    const vlsConfig = config.getAppVlsCfg(app)
    const { header, rows } = data.getAppDataByCfg({ position, application: app, config: vlsConfig })
    const bagIndex = header.findIndex((h) => h === vlsConfig.bag)
    rows.forEach((row) => bags.add(bagOptimizer(row[bagIndex])))
  })

  const periods = []
  bags.forEach((bag) => {
    if (bag) periods.push(createPeriod(bag))
  })

  return periods
}

module.exports = { genPeriods }
