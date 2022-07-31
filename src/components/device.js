const Device = require('../entities/Device')
const { getAppDataByCfg, getCellValue } = require('../helpers')
const { createDeviceTarget, TARGET, FREGAT, SWITCH } = require('../entities/DeviceTarget')
const { createHostInterface } = require('../entities/HostInterface')
const { createPort } = require('../entities/Port')
const { createMacInterface } = require('../entities/MacInterface')
const { createPartition } = require('../entities/Partition')
const { createDataPort } = require('../entities/DataPort')
const { createQueueingBuffer, createSamplingBuffer }= require('../entities/Buffer')
const config = require('../entities/Config')
const data = require('../entities/Data')

// create switch
const createDeviceSwitch = (name) => {
  const device = new Device({ 'xsi:type': 'topo:Switch', name })

  const port1 = createPort({ name: `${name}_P1`, targetId: 'PHY.1' })
  const port2 = createPort({ name: `${name}_P2`, targetId: 'PHY.2' })
  const deviceTarget = createDeviceTarget(SWITCH)

  device.addChild(port1)
  device.addChild(port2)
  device.addChild(deviceTarget)

  return device
}

// create ES device
const createDeviceMDU = (deviceName, position) => {
  const device = new Device({ 'xsi:type': 'topo:EndSystem', name: deviceName })

  const port1 = createPort({ name: `${deviceName}_P1`, targetId: 'PHY.1' })
  const port2 = createPort({ name: `${deviceName}_P2`, targetId: 'PHY.2' })
  const deviceTarget = createDeviceTarget(config.getTarget(deviceName) || TARGET)
  const hostInterface = createHostInterface(`${deviceName}_PHOST`)
  const macInterface = createMacInterface(`${deviceName}_MAC`, config.getMac(deviceName, position))

  device.addChild(port1)
  device.addChild(port2)
  device.addChild(deviceTarget)
  hostInterface.addChild(macInterface)
  device.addChild(hostInterface)

  config.applications.forEach((applicationName) => {
    const appCode = config.getAppCode(applicationName)
    const partition = createPartition(applicationName, deviceName)
    const appSheets = data.getAppSheets(applicationName)
    const portsConfig = config.getAppPorts(applicationName)
    const { rows, header } = getAppDataByCfg({ position, appSheets, config: portsConfig })

    rows.forEach((row) => {
      const isOutput = getCellValue({ row, header, name: portsConfig.isOutput.column }) === portsConfig.isOutput.value
      const isInput = getCellValue({ row, header, name: portsConfig.isInput.column }) === portsConfig.isInput.value
      const ipSourceAddress = getCellValue({ row, header, name: portsConfig.ipSourceAddress })
      const udpSourcePort = getCellValue({ row, header, name: portsConfig.udpSourcePort })
      const ipDestinationAddress = getCellValue({ row, header, name: portsConfig.ipDestinationAddress })
      const udpDestinationPort = getCellValue({ row, header, name: portsConfig.udpDestinationPort })
      const maxPayloadSize = getCellValue({ row, header, name: portsConfig.maxPayloadSize })
      const vlLink = getCellValue({ row, header, name: portsConfig.vlLink })
      const afdxPort = isOutput ? udpSourcePort : isInput ? udpDestinationPort : undefined
      const dataPortIO = isInput ? 'I' : isOutput ? 'O' : undefined
      const dataPortName = `${dataPortIO}_${appCode}_${afdxPort}`

      if (isOutput && ipSourceAddress) partition.addAttributes({ ipSourceAddress })

      if (!afdxPort) return

      if (partition.dataPortsSet.has(dataPortName)) return

      const dataPort = createDataPort()
      dataPort.vlLink = vlLink
      dataPort.io = dataPortIO
      dataPort.addAttributes({
        name: dataPortName,
        'xsi:type': `logical:${isOutput ? 'TxComUdpPort' : isInput ? 'RxComUdpPort' : undefined}`,
        maxPayloadSize: `${maxPayloadSize} byte`,
        udpSourcePort,
        udpDestinationPort,
        ipDestinationAddress,
      })

      // TODO find port type and size
      const isQueueingBuffer = true
      const fifoSize = config.defaultQueueSize
      const buffer = isQueueingBuffer ? createQueueingBuffer(fifoSize) : createSamplingBuffer()

      dataPort.addChild(buffer)

      partition.addChild(dataPort)
    })

    device.addChild(partition)
  })

  return device
}

// create network device
const createDeviceNETWORK = (deviceName, position) => {
  const device = new Device({ 'xsi:type': 'topo:EndSystem', name: deviceName })

  const port1 = createPort({ name: `${deviceName}_P1`, targetId: 'PHY.1' })
  const port2 = createPort({ name: `${deviceName}_P2`, targetId: 'PHY.2' })
  const deviceTarget = createDeviceTarget(config.getTarget(deviceName) || FREGAT)
  const hostInterface = createHostInterface(`${deviceName}_PHOST`)
  const macInterface = createMacInterface(`${deviceName}_MAC`, config.getMac(deviceName, position))

  device.addChild(port1)
  device.addChild(port2)
  device.addChild(deviceTarget)
  hostInterface.addChild(macInterface)
  device.addChild(hostInterface)

  config.applications.forEach((applicationName) => {
    const appCode = config.getAppCode(applicationName)
    const partition = createPartition(applicationName, deviceName)
    const appSheets = data.getAppSheets(applicationName)
    const portsConfig = config.getAppPorts(applicationName)
    const { rows, header } = getAppDataByCfg({ position, appSheets, config: portsConfig })

    rows.forEach((row) => {
      const isOutput = getCellValue({ row, header, name: portsConfig.isOutput.column }) === portsConfig.isOutput.value
      const isInput = getCellValue({ row, header, name: portsConfig.isInput.column }) === portsConfig.isInput.value
      const ipSourceAddress = getCellValue({ row, header, name: portsConfig.ipSourceAddress })
      const udpSourcePort = getCellValue({ row, header, name: portsConfig.udpSourcePort })
      const ipDestinationAddress = getCellValue({ row, header, name: portsConfig.ipDestinationAddress })
      const udpDestinationPort = getCellValue({ row, header, name: portsConfig.udpDestinationPort })
      const maxPayloadSize = getCellValue({ row, header, name: portsConfig.maxPayloadSize })
      const vlLink = getCellValue({ row, header, name: portsConfig.vlLink })
      const afdxPort = isOutput ? udpSourcePort : isInput ? udpDestinationPort : undefined
      const dataPortIO = isInput ? 'O' : isOutput ? 'I' : undefined // mirror io
      const dataPortName = `${dataPortIO}_${appCode}_${afdxPort}`

      if (isOutput && ipSourceAddress) partition.addAttributes({ ipSourceAddress })

      if (!afdxPort) return

      if (partition.dataPortsSet.has(dataPortName)) return

      const dataPort = createDataPort()
      dataPort.vlLink = vlLink
      dataPort.io = dataPortIO
      dataPort.addAttributes({
        name: dataPortName,
        'xsi:type': `logical:${isInput ? 'TxComUdpPort' : isOutput ? 'RxComUdpPort' : undefined}`, // mirror directions
        maxPayloadSize: `${maxPayloadSize} byte`,
        udpSourcePort,
        udpDestinationPort,
        ipDestinationAddress,
      })

      // TODO find port type and size
      const isQueueingBuffer = true
      const fifoSize = config.defaultQueueSize
      const buffer = isQueueingBuffer ? createQueueingBuffer(fifoSize) : createSamplingBuffer()

      dataPort.addChild(buffer)

      partition.addChild(dataPort)
    })

    device.addChild(partition)
  })

  return device
}

const createDevices = (position) => {
  return {
    deviceSwitch1: createDeviceSwitch('Switch1'),
    deviceSwitch2: createDeviceSwitch('Switch2'),
    deviceMDU: createDeviceMDU('MDU', position),
    deviceNetwork: createDeviceNETWORK('NETWORK', position),
  }
}

module.exports = {
  createDevices,
}
