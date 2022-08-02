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
  const fileNamesArr = fs.readdirSync(dir)
  const fileName = fileNamesArr.find((name) => name.includes(text))
  if (!fileName) throw new Error(`File "${dir}/${text}" not found`)
  return fileName
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