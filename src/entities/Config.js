const fs = require('fs')
const { readJSON } = require('../helpers')

class Config {
  defaultOutPath = './network_description'

  constructor() {
    // Read configs
    this.buildConfig = readJSON('./config/build.json')
    this.appsConfig = readJSON('./config/apps.json')
  }

  get applications() {
    return Object.values(this.buildConfig.applications)
  }

  get positions() {
    return Object.values(this.buildConfig.positions)
  }

  get OUT_PATH() {
    return this.buildConfig.outPath || defaultOutPath
  }

  get defaultQueueSize() {
    return this.buildConfig.defaultQueueSize
  }

  get marker() {
    return this.buildConfig.marker || '03:00:00:00'
  }

  get defaultJitter() {
    return this.buildConfig.defaultJitter
  }

  get networkSourceIp() {
    return this.buildConfig.networkSourceIp
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

  // getApp(appName) {
  //   return this.appsConfig[appName]
  // }

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

  check() {
    try {
      const dataDir = fs.readdirSync('./data')
      // Проверка наличия приложений в конфигурации билда
      if (!this.applications?.length) throw new Error('Applications not defined in ./config/build.json')

      // Проверка наличия папок приложений
      this.applications.forEach((app) => {
        if (!dataDir.includes(app)) throw new Error(`App ${app} folder not found in ./data`)
      })
      // Проверка наличия данных для приложений в конфиге
      this.applications.forEach((app) => {
        if (!this.appsConfig[app]) throw new Error(`App ${app} not found in ./config/apps.json`)
      })
    } catch (err) {
      console.log('CHECK CONFIG ERROR:', err)
    }
  }
}

module.exports = new Config()
