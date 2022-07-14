const fs = require('fs')

module.exports.checkConfig = ({ buildConfig, appsConfig }) => {
  console.log('')
  console.log('Check config...')

  const apps = buildConfig.applications

  const inputDir = fs.readdirSync('./data')

  // Проверка наличия приложений в конфигурации билда
  if (!apps?.length) throw new Error('Applications not defined in ./config/build.json')

  // Проверка наличия папок приложений
  apps.forEach((app) => {
    if (!inputDir.includes(app)) throw new Error(`App ${app} folder not found in ./data`)
  })

  // Проверка наличия данных для приложений в конфиге
  apps.forEach((app) => {
    if (!appsConfig[app]) throw new Error(`App ${app} not found in ./config/apps.json`)
  })

  console.log('OK!')
}
