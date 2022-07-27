const { genLink } = require('../helpers')
const Element = require('./Element')

class Device extends Element {
  constructor(attributes) {
    super('device', attributes)
  }

  get link() {
    return genLink({ device: this.attributes.name })
  }

  get linkPort1() {
    return genLink({ device: this.attributes.name, port: `${this.attributes.name}_P1` })
  }

  get linkPort2() {
    return genLink({ device: this.attributes.name, port: `${this.attributes.name}_P2` })
  }
}

module.exports = Device
