console.log('===============')
console.log('START APP')
console.log('')

try {
  const config = require('./src/entities/Config')
  const { clearDir } = require('./src/helpers')

  // clear prev gen data
  clearDir(config.OUT_PATH)

  // Check configs
  config.check()

  const { genND } = require('./src/genND')
  const { convertToXML } = require('./src/convertToXML')
  // const { execSync } = require('node:child_process')

  // gen network description
  const positions = config.positions
  for (const position of positions) {
    try {
      const nd = genND(position)
      const positionCode = config.getPositionCode(position)
      convertToXML({ nd, positionCode, path: config.OUT_PATH })
      console.log('Done!')

      // try {
      //   console.log('Clear')
      //   execSync(`CALL clear.bat ${positionCode}`)
      // } catch (e) {
      //   // lo
      // }

      // console.log('Plan shedule')
      // execSync(`CALL plan.bat ${positionCode}`)

      // console.log('Plan build dc')
      // execSync(`build_dc.bat ${positionCode}`)

      // console.log('Plan build bin')
      // execSync(`build_bin.bat ${positionCode}`)
      // console.log('Copy...')
      // execSync(`copy_to_delivery.bat ${positionCode}`)
    } catch (err) {
      console.error(err.message)
    }
  }

  console.log('')
  console.log('END APP')
  console.log('===============')
  return 0
} catch (err) {
  console.error(err.message)
  return 1
}
