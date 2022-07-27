const Period = require('../entities/Period')
const config = require('../entities/Config')
const data = require('../entities/Data')
const { getAppDataByCfg } = require('../helpers')

const createPeriod = (time) => new Period(time)

const createPeriods = (position) => {
  const bags = new Set()
  config.applications.forEach((app) => {
    const vlsConfig = config.getAppVls(app)
    const appSheets = data.getAppSheets(app)
    const { header, rows } = getAppDataByCfg({ position, appSheets, config: vlsConfig })
    const bagIndex = header.findIndex((h) => h === vlsConfig.bag)
    rows.forEach((row) => bags.add(row[bagIndex]))
  })

  const periods = []
  bags.forEach((bag) => {
    if (bag) periods.push(createPeriod(bag))
  })

  return periods
}

module.exports = { createPeriods }
