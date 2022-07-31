const Element = require("./Element")

class Period extends Element {
  constructor (time) {
    super('period',  { name: `BAG_${time}`, time: `${time} ms` })
    this.time = time 
  }

  get value () {
    return this.time
  }
}

const createPeriod = (time) => new Period(time)

module.exports = { Period, createPeriod }
