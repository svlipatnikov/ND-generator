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

// clear prev gen data
clearDir(config.OUT_PATH)

// gen network description
const positions = config.positions
for (const position of positions) {
  const nd = genND(position)
  const posNum = config.getPosNum(position)
  const enPositionName = config.getEnPositionName(position)
  convertToXML({ nd, enPositionName, posNum, path: config.OUT_PATH })
}

console.log('')
console.log('END APP')
console.log('===============')
