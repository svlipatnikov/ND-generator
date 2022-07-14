const { checkConfig } = require('./src/checkConfig')
const { readFiles } = require('./src/readFiles')
const { openSheets } = require('./src/openSheets')
const { readJSON } = require('./src/helpers')

console.log('START APP')

// Read configs
const buildConfig = readJSON('./config/build.json')
const appsConfig = readJSON('./config/apps.json')

// Check
checkConfig({ buildConfig, appsConfig })

// Read files
const filesData = readFiles({ buildConfig, appsConfig })

// Read xlsx sheets as json
const sheets = openSheets({ filesData, buildConfig, appsConfig })

console.log('END APP')
