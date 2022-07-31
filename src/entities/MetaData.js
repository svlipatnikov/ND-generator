const Element = require('../entities/Element')

class MetaData extends Element {
  constructor(position) {
    super('metaData', {
      dataid: `Network_description_${position}`,
      author: 'Lipatnikov',
      description: `Network_description_${position}`,
      date: new Date().toISOString(),
      creationDate: new Date().toISOString(),
      creationTool: 'TTE',
      creationToolVersion: '5.2',
      version: '',
      licensee: '',
      company: 'UIMDB',
    })
  }
}

const createMetaData = (position = 'test') => new MetaData(position)

module.exports = { createMetaData }
