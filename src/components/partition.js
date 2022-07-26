const Element = require('../entities/Element')

const createPartition = (partitionName, deviceName) => {
  const partition = new Element('partition', {
    name: `${deviceName}_${partitionName}`,
    logicalInterface: `//@device[name='${deviceName}']/@hostInterface[name='${deviceName}_PHOST']`,
    // ipSourceAddress, // TODO
  })

  return partition
}

module.exports = { createPartition }
