const Element = require('./Element')
const config = require('./Config')
const { genLink } = require('../helpers')

class Partition extends Element {
  _dataPortsSet = new Set()

  constructor(attributes) {
    super('partition', attributes)
  }

  get dataPortsSet() {
    return this._dataPortsSet
  }

  addChild(element) {
    try {
      this.children = [...this.children, element]
    } catch (err) {
      console.log('Add parameter error: ', err)
    }

    if (element.name === 'dataPort') {
      this._dataPortsSet.add(element.attributes.name)
    }
  }
}

const createPartition = (partitionName, deviceName) => {
  const appCode = config.getAppCode(partitionName)

  const partition = new Partition({
    name: `${deviceName}_${appCode}`,
    logicalInterface: genLink({ device: deviceName, hostInterface: `${deviceName}_PHOST` }),
  })

  return partition
}

module.exports = { Partition, createPartition }
