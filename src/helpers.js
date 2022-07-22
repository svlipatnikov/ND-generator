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

module.exports.saveFile = (path, position, file) => {
  const filePath = path + `/${position}.network_description`

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

module.exports.getAppDataByCfg = ({ position, appData, dataConfig = {} }) => {
  const { sheet, filters, posColumn } = dataConfig

  const header = appData[sheet].header
  let rows = [...appData[sheet].data]

  const posColumnIndex = header.findIndex((h) => h === posColumn)
  if (posColumnIndex !== -1) rows = rows.filter((r) => r[posColumnIndex] === position)

  Object.entries(filters || {}).forEach(([name, value]) => {
    const columnIndex = header.findIndex((h) => h === name)
    rows = rows.filter((r) => r[columnIndex] === value)
  })

  return { rows, header }
}
