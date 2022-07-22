const { clearDir } = require('./src/helpers')
const { readFiles } = require('./src/readFiles')
const { openSheets } = require('./src/openSheets')
const { genND } = require('./src/genND')
const { convertToXML } = require('./src/convertToXML')

const config = require('./src/entities/Config')

console.log('===============')
console.log('START APP')

// Check configs
config.check()

// Read files
const filesData = readFiles()

// Read xlsx sheets as json
const sheetsData = openSheets(filesData)

// clear prev gen data
clearDir(config.OUT_PATH)

// gen network description
const positions = config.positions
for (let num = 0; num < positions.length; num++) {
  const position = positions[num]
  const nd = genND({ num, position, sheetsData })
  convertToXML({ nd, position, path: config.OUT_PATH })
}

console.log('')
console.log('END APP')
console.log('===============')
