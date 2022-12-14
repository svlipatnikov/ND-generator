console.log('')
console.log('===== START gen-fregat =====')

const fs = require('fs')
const { getFileName, decodeVl2PortsFile, clearDir } = require('./src/helpers')
const data = require('./src/entities/Data')

// const buildConfig = require('./Config')

const FREGAT_DATA_FOLDER = 'FREGAT_DATA'
const DELIVERY_FOLDER = 'DELIVERY'
const X2P_FILE_NAME = 'vl2ports.utst'

// check delivery path
if (!fs.readdirSync('.').includes(DELIVERY_FOLDER)) {
  console.log('ERROR. Folder:', DELIVERY_FOLDER, 'not found')
  return
}

const fregatDataFolder = getFileName(DELIVERY_FOLDER, 'Fregat')
if (!fregatDataFolder) return

const positions = fs.readdirSync(`${DELIVERY_FOLDER}/${fregatDataFolder}`)
if (!positions.length) {
  console.log('ERROR. Empty folder:', `${DELIVERY_FOLDER}/${fregatDataFolder}`)
  return
}

if (fs.readdirSync('.').includes(FREGAT_DATA_FOLDER)) {
  clearDir(`./${FREGAT_DATA_FOLDER}`)
} else {
  fs.mkdirSync(`./${FREGAT_DATA_FOLDER}`)
}

positions.forEach((posCode) => {
  console.log(`Gen Mes_Size & Mes_Size_out for ${posCode}`)
  const x2pFile = fs.readFileSync(`${DELIVERY_FOLDER}/${fregatDataFolder}/${posCode}/${X2P_FILE_NAME}`)
  const x2pData = decodeVl2PortsFile(x2pFile)
  const mesSizeHash = data.getMesSizeHash(posCode)

  const inMesSizeFile = x2pData
    .filter(({ IO }) => IO === 'I')
    .sort((a, b) => Number(a.ttePortNumber) - Number(b.ttePortNumber))
    .map(({ ttePortNumber, afdxPort }) => `${mesSizeHash[afdxPort]} ${ttePortNumber}` + '\r\n')
    .join('')

  const outMesSizeFile = x2pData
    .filter(({ IO }) => IO === 'O')
    .sort((a, b) => Number(a.ttePortNumber) - Number(b.ttePortNumber))
    .map(({ ttePortNumber, afdxPort }) => `${mesSizeHash[afdxPort]} ${ttePortNumber}` + '\r\n')
    .join('')

  const posDir = `./${FREGAT_DATA_FOLDER}/${posCode}`
  fs.mkdirSync(posDir)
  fs.writeFileSync(`${posDir}/${posCode}_Mes_Size_Out.txt`, inMesSizeFile)
  fs.writeFileSync(`${posDir}/${posCode}_Mes_Size.txt`, outMesSizeFile)
})

console.log('===== END gen-fregat =====')
console.log('')
