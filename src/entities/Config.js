const fs = require('fs')
const { readJSON } = require('../helpers')

DEFAULT_OUT_PATH = './deliverys'

class Config {
  constructor() {
    // Read configs
    this.buildConfig = readJSON('./config/build.json')
    this.appsConfig = readJSON('./config/apps.json')
  }

  get applications() {
    return Object.values(this.buildConfig.applications)
  }

  get appCodes() {
    return Object.keys(this.buildConfig.applications)
  }

  get positions() {
    return Object.values(this.buildConfig.positions)
  }

  get OUT_PATH() {
    return this.buildConfig.outPath || DEFAULT_OUT_PATH
  }

  get DATA_PATH() {
    return this.buildConfig.dataPath
  }

  get defaultDataPortSize() {
    return this.buildConfig.defaults.dataPortSize
  }

  get defaultDataPortType() {
    return this.buildConfig.defaults.dataPortType
  }

  get marker() {
    return this.buildConfig.marker || '03:00:00:00'
  }

  get defaultJitter() {
    return this.buildConfig.defaults.jitter
  }

  get networkSourceIp() {
    return this.buildConfig.networkSourceIp
  }

  check() {
    try {
      const dataDir = fs.readdirSync('./data')
      // Проверка наличия приложений в конфигурации билда
      if (!this.appCodes?.length) throw new Error('Applications not defined in ./config/build.json')

      // Проверка наличия папок приложений
      this.appCodes.forEach((appCode) => {
        if (!dataDir.includes(appCode)) throw new Error(`App ${appCode} folder not found in ./data`)
      })
      // Проверка наличия данных для приложений в конфиге
      this.applications.forEach((appCode) => {
        if (!this.appsConfig[appCode]) throw new Error(`App ${appCode} not found in ./config/apps.json`)
      })
    } catch (err) {
      console.log('CHECK CONFIG ERROR:', err)
    }
  }

  getAppCode(application) {
    return Object.entries(this.buildConfig.applications).find(([enName, name]) => name === application)[0]
  }

  getPositionCode(position) {
    const posNum = this.getPosNum(position)
    return Object.keys(this.buildConfig.positions)[posNum - 1]
  }

  getPosNum(position) {
    return this.positions.findIndex((p) => p === position) + 1
  }

  getMac(deviceName, position) {
    const index = this.positions.findIndex((p) => p === position)
    return this.buildConfig.macInterface[deviceName][index]
  }

  getTarget(deviceName) {
    return this.buildConfig.targetDevice[deviceName]
  }

  getAppFiles(appName) {
    return this.appsConfig[appName].files
  }

  getAppSheets(appName) {
    return this.appsConfig[appName].sheets
  }

  getAppPortsCfg(appName) {
    return this.appsConfig[appName].ports
  }

  getAppVlsCfg(appName) {
    return this.appsConfig[appName].vls
  }

  getAppPortTypesCfg(appName) {
    return this.appsConfig[appName].portTypes
  }
}

module.exports = new Config()
