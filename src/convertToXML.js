const { saveFile } = require('./helpers')
const convert = require('xml-js')

module.exports.convertToXML = ({ nd, enPositionName, posNum, path }) => {
  console.log(`Convert to XML (${enPositionName})`)

  // convert nd-js to nd-xml
  const nd_xml = convert.js2xml(nd, {
    compact: true,
    ignoreComment: true,
    spaces: 4,
    indentCdata: true,
    // indentAttributes: true,
  })

  // save nd file
  saveFile(path, enPositionName, posNum, nd_xml)
}
