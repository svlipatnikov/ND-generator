const Element = require('./Element')

class Device extends Element {
  constructor(name, attributes) {
    super(name, attributes)
  }

  get link() {
    return `//@device[name='${this.attributes.name}']`
  }

  get linkPort1() {
    return `//@device[name='${this.attributes.name}']/@port[name='${this.attributes.name}_P1']`
  }

  get linkPort2() {
    return `//@device[name='${this.attributes.name}']/@port[name='${this.attributes.name}_P1']`
  }
}

module.exports = Device
