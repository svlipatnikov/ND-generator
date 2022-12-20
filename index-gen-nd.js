console.log('')
console.log('===== START NETWORK DESCRIPTION GENERATOR ====')

const config = require('./src/entities/Config')
const { clearDir } = require('./src/helpers')

// clear prev gen data
clearDir(config.OUT_PATH)

// Check configs
config.check()

const { genND } = require('./src/genND')
const { convertToXML } = require('./src/convertToXML')

// gen network description
const positions = config.positions
for (const position of positions) {
  try {
    const nd = genND(position)
    const positionCode = config.getPositionCode(position)
    convertToXML({ nd, positionCode, path: config.OUT_PATH })
    console.log('Done!')
  } catch (err) {
    console.error(err.message)
  }
}

console.log('===== END APP =====')
console.log('')
