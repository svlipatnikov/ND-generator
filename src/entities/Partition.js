const Element = require("./Element")

class Partition extends Element {
  _dataPortsSet = new Set()

  constructor (attributes) {
    super ('partition', attributes)
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

module.exports = Partition
