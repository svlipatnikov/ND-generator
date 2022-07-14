const fs = require('fs')

// module.exports.getApps = () => {
//   return fs.readFileSync('apps.txt').toString().split('\r\n')
// }

// module.exports.getPos = () => {
//   return fs.readFileSync('positions.txt').toString().split('\r\n')
// }

module.exports.readJSON = (path) => {
  const file = fs.readFileSync(path)
  if (!file) throw new Error(`File ${path} not found`)
  return JSON.parse(file)
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
