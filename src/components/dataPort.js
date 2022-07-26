const DataPort = require('../entities/DataPort')

const createDataPort = (name = '') => new DataPort(name)

module.exports = { createDataPort }
