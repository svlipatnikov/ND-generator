const Element = require('../entities/Element')

const createDeclaration = (version = '1.0', encoding = 'UTF-8') =>
  new Element('_declaration', { version, encoding })

module.exports = { createDeclaration }
