const { clearDir } = require('./src/helpers')
const { genND } = require('./src/genND')
const { convertToXML } = require('./src/convertToXML')

const config = require('./src/entities/Config')

console.log('===============')
console.log('START APP')
console.log('')

// Check configs
config.check()

// clear prev gen data
clearDir(config.OUT_PATH)

// gen network description
const positions = config.positions
for (const position of positions) {
  const nd = genND(position)
  const positionCode = config.getPositionCode(position)
  convertToXML({ nd, positionCode, path: config.OUT_PATH })
}

console.log('')
console.log('END APP')
console.log('===============')
