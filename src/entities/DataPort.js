const Element = require('./Element')

class DataPort extends Element {
  constructor(name) {
    super('dataPort', { name })
  }

  set vlLink(uniqueVl) {
    this.uniqueVl = uniqueVl
  }

  get vlLink() {
    return this.uniqueVl
  }

  set io (direction) {
    this.direction = direction
  }

  get io () {
    return this.direction
  }
}

module.exports = DataPort
