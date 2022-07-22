const Element = require('../entities/Element')

const createPeriod = (time) => new Element('period', { name: `BAG_${time}`, time: `${time} ms` })

const createPeriods = ({ num, position, sheetsData }) => {
  // read config data
  const buildConfig = readJSON('./config/build.json')
  const applications = buildConfig.applications || []
  const targetDevice = buildConfig.targetDevice || { MDU: TARGET, NETWORK: FREGAT }
  const mac = buildConfig.macInterface || { MDU: '02:00:00:00:00:01', NETWORK: '02:00:00:00:00:01' }
}
