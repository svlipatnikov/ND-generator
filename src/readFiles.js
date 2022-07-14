const xlsx = require('xlsx')

module.exports.readFiles = ({ buildConfig, appsConfig }) => {
  console.log('')
  console.log('Read files...')

  const apps = buildConfig.applications

  const filesData = {}

  apps.forEach((app) => {
    filesData[app] = {}

    const files = appsConfig[app].files
    Object.keys(files).forEach((file) => {
      const excelData = xlsx.readFile(`${files[file]}`)
      if (!excelData) throw new Error(`Read file ${files[file]} error`)
      filesData[app][file] = excelData
    })
  })

  console.log('OK!')

  return filesData
}
