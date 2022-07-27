const config = require('../entities/Config')
const Partition = require('../entities/Partition')
const { genLink } = require('../helpers')

const createPartition = (partitionName, deviceName) => {
  const enAppName = config.getEnAppName(partitionName)

  const partition = new Partition({
    name: `${deviceName}_${enAppName}`,
    logicalInterface: genLink({ device: deviceName, hostInterface: `${deviceName}_PHOST` }),
  })

  return partition
}

module.exports = { createPartition }
