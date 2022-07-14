// const fs = require('fs')
const xlsx = require('xlsx')
// const { readJSON } = require('./helpers')

// const buildConfig = readJSON('./config/build.json')
// const appsData = readJSON('./config/apps.json')

module.exports.openSheets = ({ filesData, buildConfig, appsConfig }) => {
  console.log('')
  console.log('Open sheets data...')

  const sheets = {}

  const apps = buildConfig.applications

  apps.forEach((app) => {
    sheets[app] = {}
    const appSheets = appsConfig[app].sheets

    Object.keys(appSheets).forEach((sheet) => {
      const sheetFile = appSheets[sheet].file
      const sheetName = appSheets[sheet].name
      const headerRowNumber = appSheets[sheet].headerRowNumber

      const excelData = filesData[app][sheetFile]
      const sheetRows = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName], { header: 1 })

      if (!sheetRows.length)
        throw new Error(`Open sheet "${sheetName}" in ${sheetFile} (${app}) error`)

      const contentRows = sheetRows.slice(headerRowNumber - 1)
      sheets[app][sheet] = contentRows
    })
  })

  console.log('OK!')

  return sheets
}
