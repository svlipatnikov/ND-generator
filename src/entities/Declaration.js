const Element = require('../entities/Element')

class Declaration extends Element {
  constructor (version = '1.0', encoding = 'UTF-8') { 
    super('_declaration', { version, encoding })
  }
}

const createDeclaration = (version, encoding) =>
  new Declaration(version, encoding)

module.exports = { Declaration, createDeclaration }
