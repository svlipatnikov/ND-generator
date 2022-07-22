const { saveFile } = require('./helpers')
const convert = require('xml-js')

module.exports.convertToXML = ({ nd, position, path }) => {
  console.log(`Convert to XML (${position})`)

  // convert nd-js to nd-xml
  const nd_xml = convert.js2xml(nd, {
    compact: true,
    ignoreComment: true,
    spaces: 2,
    indentCdata: true,
    // indentAttributes: true,
  })

  // save nd file
  saveFile(path, position, nd_xml)
}
