console.log('')
console.log('===== START gen-x2p-app =====')

const fs = require('fs')
const { getFileName, decodeHFile, getPortsArr } = require('./src/helpers')
const data = require('./src/entities/Data')

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

positions.forEach((pos) => {
  console.log('Gen vl2ports.utst file for', pos)
  const posDir = `${DELIVERY_FOLDER}/${fregatDataFolder}/${pos}`

  const portNameHash = data.getPortNameHash(pos)

  const rxFile = fs.readFileSync(`${posDir}/NETWORK_PERSEUS_COM_RX_V0.h`)
  const rxData = decodeHFile(rxFile)

  const txDataFile = fs.readFileSync(`${posDir}/NETWORK_PERSEUS_COM_TX_V0.h`)
  const txData = decodeHFile(txDataFile)

  const x2pArr = [...getPortsArr(rxData, portNameHash, 'I'), ...getPortsArr(txData, portNameHash, 'O')]

  try {
    fs.rmSync(`${posDir}/${X2P_FILE_NAME}`)
  } catch (e) {}
  fs.writeFileSync(`${posDir}/${X2P_FILE_NAME}`, x2pArr.join(''))
})

console.log('===== END gen-x2p-app =====')
console.log('')
