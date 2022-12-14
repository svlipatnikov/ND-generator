const { saveFile } = require('./helpers')
const convert = require('xml-js')

module.exports.convertToXML = ({ nd, positionCode, path }) => {
  console.log(`Convert to XML (${positionCode})...`)

  // convert nd-js to nd-xml
  const nd_xml = convert.js2xml(nd, {
    compact: true,
    ignoreComment: true,
    spaces: 4,
    indentCdata: true,
  })

  // save nd file
  saveFile(path, positionCode, nd_xml)
}
