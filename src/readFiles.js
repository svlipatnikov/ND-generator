const xlsx = require('xlsx')
const config = require('./entities/Config')

module.exports.readFiles = () => {
  console.log('')
  console.log('Read files...')

  const filesData = {}

  config.applications.forEach((app) => {
    filesData[app] = {}

    const files = config.getAppFiles(app)

    Object.keys(files).forEach((file) => {
      const excelData = xlsx.readFile(`${files[file]}`)
      if (!excelData) throw new Error(`Read file ${files[file]} error`)
      filesData[app][file] = excelData
    })
  })

  console.log('OK!')

  return filesData
}
