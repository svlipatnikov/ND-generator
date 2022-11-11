const fs = require('fs')

module.exports.readJSON = (path) => {
  try {
    const file = fs.readFileSync(path)
    return JSON.parse(file)
  } catch (err) {
    console.log(`File ${path} not found. ERROR:`, err)
    return {}
  }
}

module.exports.getFileName = (dir, text = '') => {
  try {
    const textLC = text.trim().toLowerCase()
    const fileNamesArr = fs.readdirSync(dir)
    const fileName = fileNamesArr.find((name) => name.toLowerCase().includes(textLC))
    if (!fileName) throw new Error(`File "${dir}/${text}" not found`)
    return fileName
  } catch (e) {
    console.log(`ERROR in "getFileName": File with text "${text}" in: `, dir)
    return null
  }
}

module.exports.getSheetContent = (data, headerIndex = 1) => {
  const header = data[headerIndex]
  if (header.some((headerCell) => !headerCell)) throw new Error('Header of sheet not found')
  return data.splice(headerIndex)
}

module.exports.clearDir = (path) => {
  try {
    fs.rmSync(path, { recursive: true })
  } catch (err) {
    // console.log(err)
  }

  fs.mkdirSync(path)
}

module.exports.saveFile = (path, positionCode, file) => {
  const filePath = path + `/A664_NWD_${positionCode}.network_description`

  fs.rm(filePath, (err) => {
    // if (err) console.log(err)
  })

  fs.writeFile(filePath, file, (err) => {
    if (err) console.log(err)
  })
}

module.exports.getCellValue = ({ row = [], header = [], name = '' }) => {
  const index = header.indexOf(name)
  if (index === -1) return undefined
  return row[index]
}

module.exports.genLink = (linkData) => {
  return Object.entries(linkData).reduce((link, [element, name]) => link + `/@${element}[name='${name}']`, '/')
}

module.exports.decodeVl2PortsFile = (file) => {
  try {
    return file
      .toString()
      .split('\r\n')
      .filter((row) => !!row)
      .map((row) => {
        const [portCode, ttePortNumber] = row.split(' = ')
        const [prefix, afdxPort] = portCode.split('_')
        return {
          IO: prefix === 'XIP' ? 'I' : prefix === 'XOP' ? 'O' : undefined,
          ttePortNumber,
          afdxPort,
        }
      })
  } catch (e) {
    console.log('Error decoding vl2ports.utst file')
    return
  }
}

module.exports.decodeHFile = (file) => {
  try {
    return file
      .toString()
      .split('\r\n')
      .filter((row) => !!row)
      .map((row) => row.split(' ').filter((c) => !!c))
  } catch (e) {
    console.log('Error decoding .h file')
    return
  }
}

module.exports.getPortsArr = (rows, portNameHash, IO) => {
  return rows.map((row) => {
    const [, ttePortName, portNumber] = row
    const portName = ttePortName.slice(ttePortName.indexOf('_') + 1)
    const afdxPort = portNameHash[portName]
    return `X${IO}P_${afdxPort} = ${portNumber}` + '\r\n'
  })
}

module.exports.stringifyParams = (params) => {
  return Object.entries(params).reduce((acc, [key, value]) => acc + `${key}=${value} `, '')
}

const BAGS = [1, 2, 4, 8, 16, 32, 64, 128]
module.exports.bagOptimizer = (bag) => {
  if (BAGS.includes(bag)) return bag
  return BAGS.find((b) => b > bag) || 128
}
