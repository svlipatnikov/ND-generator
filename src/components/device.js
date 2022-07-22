const Element = require('../entities/Element')
const Device = require('../entities/Device')
const { readJSON, getAppDataByCfg, getCellValue } = require('../helpers')
const { createDeviceTarget, TARGET, FREGAT, SWITCH } = require('./deviceTarget')
const { createHostInterface } = require('./hostinterface')
const { createPort } = require('./port')
const { createMacInterface } = require('./macInterface')
const { createPartition } = require('./partition')
const { createDataPort } = require('./dataPort')
const { createQueueingBuffer, createSamplingBuffer } = require('./buffer')

// create switch
const createDeviceSwitch = (name) => {
  const device = new Device('device', { 'xsi:type': 'topo:Switch', name })

  const port1 = createPort({ name: `${name}_P1`, targetId: 'PHY.1' })
  const port2 = createPort({ name: `${name}_P2`, targetId: 'PHY.2' })
  const deviceTarget = createDeviceTarget(SWITCH)

  device.addChild(port1)
  device.addChild(port2)
  device.addChild(deviceTarget)

  return device
}

// read config data
const buildConfig = readJSON('./config/build.json')
const applications = buildConfig.applications || []
const targetDevice = buildConfig.targetDevice || { MDU: TARGET, NETWORK: FREGAT }
const mac = buildConfig.macInterface || { MDU: '02:00:00:00:00:01', NETWORK: '02:00:00:00:00:01' }

// create ES device
const createDeviceES = ({ deviceName, num, position, sheetsData }) => {
  const device = new Device('device', { 'xsi:type': 'topo:EndSystem', name: `ES_${deviceName}` })

  const port1 = createPort({ name: `${deviceName}_P1`, targetId: 'PHY.1' })
  const port2 = createPort({ name: `${deviceName}_P2`, targetId: 'PHY.2' })
  const deviceTarget = createDeviceTarget(targetDevice[deviceName])
  const hostInterface = createHostInterface(`ES_${deviceName}_PHOST`)
  const macInterface = createMacInterface(`ES_${deviceName}_MAC`, mac[deviceName][num])

  device.addChild(port1)
  device.addChild(port2)
  device.addChild(deviceTarget)
  hostInterface.addChild(macInterface)
  device.addChild(hostInterface)

  applications.forEach((applicationName) => {
    const partition = createPartition(applicationName, deviceName)

    const appData = sheetsData[applicationName]
    const portsConfig = readJSON('./config/apps.json')[applicationName].ports
    const { rows, header } = getAppDataByCfg({ position, appData, dataConfig: portsConfig })

    rows.forEach((row) => {
      const isOutput = getCellValue({ row, header, name: portsConfig.isOutput.column }) === portsConfig.isOutput.value
      const isInput = getCellValue({ row, header, name: portsConfig.isInput.column }) === portsConfig.isInput.value
      const ipSourceAddress = getCellValue({ row, header, name: portsConfig.ipSourceAddress })
      const udpSourcePort = getCellValue({ row, header, name: portsConfig.udpSourcePort })
      const ipDestinationAddress = getCellValue({ row, header, name: portsConfig.ipDestinationAddress })
      const udpDestinationPort = getCellValue({ row, header, name: portsConfig.udpDestinationPort })
      const maxPayloadSize = getCellValue({ row, header, name: portsConfig.maxPayloadSize })
      const afdxPort = isOutput ? udpSourcePort : isInput ? udpDestinationPort : undefined

      if (isOutput && ipSourceAddress) partition.addAttributes({ ipSourceAddress })

      const dataPort = createDataPort()
      dataPort.addAttributes({
        name: `${applicationName}_${afdxPort}`,
        'xsi:type': `logical:${isOutput ? 'TxComUdpPort' : isInput ? 'RxComUdpPort»' : undefined}`,
        maxPayloadSize: `${maxPayloadSize} byte`,
        udpSourcePort,
        udpDestinationPort,
        ipDestinationAddress,
      })

      // TODO find port type and size
      const isQueueingBuffer = true
      const fifoSize = buildConfig.defaultQueueSize
      const buffer = isQueueingBuffer ? createQueueingBuffer(fifoSize) : createSamplingBuffer()

      dataPort.addChild(buffer)

      partition.addChild(dataPort)
    })

    device.addChild(partition)
  })

  return device
}

const createDevices = ({ num, position, sheetsData }) => {
  return {
    deviceSwitch1: createDeviceSwitch('Switch1'),
    deviceSwitch2: createDeviceSwitch('Switch2'),
    deviceNetwork: createDeviceES({ deviceName: 'NETWORK', num, position, sheetsData }),
    deviceMDU: createDeviceES({ deviceName: 'MDU', num, position, sheetsData }),
  }
}

module.exports = {
  createDevices,
}
