const config = require('./Config')
const xlsx = require('xlsx')

class Data {
  config = {}
  _files = {}
  _sheets = {}

  constructor(config) {
    this.config = config
  }

  readFiles() {
    this.config.applications.forEach((app) => {
      this._files[app] = {}
      const appFiles = config.getAppFiles(app)

      Object.keys(appFiles).forEach((fileName) => {
        this.files[app][fileName] = xlsx.readFile(`${appFiles[fileName]}`)
      })
    })
  }

  convertXLSX2js() {
    this.config.applications.forEach((app) => {
      this._sheets[app] = {}
      const appSheets = config.getAppSheets(app)

      Object.keys(appSheets).forEach((sheet) => {
        const sheetFile = appSheets[sheet].file
        const sheetName = appSheets[sheet].name
        const headerRowNumber = appSheets[sheet].headerRowNumber

        const excelData = this._files[app][sheetFile]
        const sheetRows = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName], { header: 1 })

        const content = sheetRows.slice(headerRowNumber - 1)
        this._sheets[app][sheet] = {
          header: content.shift(),
          data: content,
        }
      })
    })
  }

  get sheets() {
    return this._sheets
  }

  get files() {
    return this._files
  }
}

const data = new Data(config)
data.readFiles()
data.convertXLSX2js()

module.exports = {
  sheets: data.sheets,
  files: data.files,
}
