const Element = require('../entities/Element')

const createMetaData = (position = 'test') =>
  new Element('metaData', {
    dataid: `Network_description_${position}`,
    author: 'Lipatnikov',
    description: `Network_description_${position}`,
    date: new Date().toISOString(),
    creationDate: new Date().toISOString(),
    creationTool: 'TTE',
    creationToolVersion: '',
    version: '',
    licensee: '',
    company: 'UIMDB',
  })

module.exports = { createMetaData }
