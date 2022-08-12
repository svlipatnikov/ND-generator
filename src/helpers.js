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
  const index = header.findIndex((h) => h === name)
  if (index === -1) return undefined
  return row[index]
}

module.exports.genLink = (linkData) => {
  return Object.entries(linkData).reduce((link, [element, name]) => link + `/@${element}[name='${name}']`, '/')
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

module.exports.getPortsArr = (rows, IO) => {

  return rows.map(row => {
    const [, portName, portNumber] = row
    return `X${IO}P_${portName.split('_').at(-1)} = ${portNumber}` + "\r\n"
  })
}