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
    Object.entries(this.config.buildConfig.applications).forEach(([appCode, appName]) => {
      this._files[appName] = {}
      const appFiles = config.getAppFiles(appName)

      Object.entries(appFiles).forEach(([fileCode, fileName]) => {
        this.files[appName][fileCode] = xlsx.readFile(this.config.DATA_PATH + '/' + appCode + '/' + fileName)
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
        const sheetRows = xlsx.utils.sheet_to_json(excelData.Sheets[sheetName], { header: 1, defval: null })

        const content = sheetRows.slice(headerRowNumber - 1)

        // fill empty merged cells
        content.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            try {
              if (cell === null && rowIndex > 0) content[rowIndex][cellIndex] = content[rowIndex - 1][cellIndex]
            } catch (e) {
              console.log('Error: Data > convertXLSX2js > unMerge cells: ', sheetName, ' row:', rowIndex, ' cell:', cellIndex)
            }
          })
        })

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

  getAppSheets(appName) {
    return this._sheets[appName]
  }

  getAppSheet(appName, sheetName) {
    const appSheets = this.getAppSheets(appName) || {}
    return appSheets[sheetName]
  }

  getAppDataByCfg({ position, application, config }) {
    const { sheet, filters, posColumn, extra } = config

    let { header, data } = this.getAppSheet(application, sheet)
    let rows = [...data]

    // filter rows by position
    // object = array of strings
    if (typeof posColumn === 'object') {
      rows = rows.filter((r) =>
        posColumn.some((posTitle) => {
          const posTitleIndex = header.indexOf(posTitle)
          return r[posTitleIndex] === position
        })
      )
    }
    if (typeof posColumn === 'string') {
      const posColumnIndex = header.indexOf(posColumn)
      if (posColumnIndex !== -1) rows = rows.filter((r) => r[posColumnIndex] === position)
    }

    // filter rows by custom filters
    Object.entries(filters || {}).forEach(([column, value]) => {
      const columnIndex = header.indexOf(column)
      rows = rows.filter((r) => r[columnIndex] === value)
    })

    // add extra columns from other sheet
    if (extra) {
      const { sheet: extraSheet, mapping, columns: extraColumns } = extra
      const { data: extraRows, header: extraHeader } = this.getAppSheet(application, extraSheet)
      const extraColumnIndexes = extraColumns.map((eCol) => extraHeader.indexOf(eCol))

      header = [...header, ...extraColumns]
      rows = rows.map((row) => {
        const extraRow = extraRows.find((eRow) =>
          Object.entries(mapping).every(([col, eCol]) => row[header.indexOf(col)].toString() === eRow[extraHeader.indexOf(eCol).toString()])
        )
        if (!extraRow) return row
        const extraValues = extraColumnIndexes.map((index) => extraRow[index])
        return [...row, ...extraValues]
      })
    }

    return { rows, header }
  }

  getMesSizeHash(posCode) {
    const posName = this.config.buildConfig.positions[posCode]
    const mesSizeHash = {}
    this.config.applications.forEach((appName) => {
      const portsConfig = config.getAppPortsCfg(appName)
      const { rows, header } = this.getAppDataByCfg({ position: posName, application: appName, config: portsConfig })

      const mesSizeIndex = header.indexOf(portsConfig.maxPayloadSize)
      const afdxPortIndex = header.indexOf(portsConfig.udpDestinationPort)

      rows.forEach((row) => {
        const mesSize = row[mesSizeIndex]
        const afdxPort = row[afdxPortIndex]
        mesSizeHash[afdxPort] = mesSize
      })
    })
    return mesSizeHash
  }

  getPortNameHash(posCode) {
    const posName = this.config.buildConfig.positions[posCode]
    const posNameHash = {}
    this.config.applications.forEach((appName) => {
      const portsConfig = config.getAppPortsCfg(appName)
      const { rows, header } = this.getAppDataByCfg({ position: posName, application: appName, config: portsConfig })

      const portNameIndex = header.indexOf(portsConfig.portName)
      const afdxPortIndex = header.indexOf(portsConfig.udpDestinationPort)

      rows.forEach((row) => {
        const portName = row[portNameIndex]
        const afdxPort = row[afdxPortIndex]
        posNameHash[portName] = afdxPort
      })
    })
    return posNameHash
  }
}

const data = new Data(config)
data.readFiles()
data.convertXLSX2js()

module.exports = data
