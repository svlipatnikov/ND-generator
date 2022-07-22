const xlsx = require('xlsx')
const config = require('./entities/Config')

module.exports.openSheets = (filesData) => {
  console.log('')
  console.log('Open sheets data...')

  const sheets = {}

  config.applications.forEach((app) => {
    sheets[app] = {}
    const appSheets = config.getAppSheets(app)

    Object.keys(appSheets).forEach((sheet) => {
      const sheetFile = appSheets[sheet].file
      const sheetName = appSheets[sheet].name
      const headerRowNumber = appSheets[sheet].headerRowNumber

      const excelData = filesData[app][sheetFile]
      const sheetRows = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName], { header: 1 })

      if (!sheetRows.length) throw new Error(`Open sheet "${sheetName}" in ${sheetFile} (${app}) error`)

      const content = sheetRows.slice(headerRowNumber - 1)
      sheets[app][sheet] = { header: content.shift(), data: content }
    })
  })

  console.log('OK!')

  return sheets
}
