const Device = require('../entities/Device')
const { getCellValue } = require('../helpers')
const { createDeviceTarget, TARGET, FREGAT, SWITCH } = require('../entities/DeviceTarget')
const { createHostInterface } = require('../entities/HostInterface')
const { createMacInterface } = require('../entities/MacInterface')
const { createPartition } = require('../entities/Partition')
const { createDataPort } = require('../entities/DataPort')
const { createBuffer } = require('../entities/Buffer')
const config = require('../entities/Config')
const data = require('../entities/Data')
const { genPorts } = require('./genPorts')

// create switch
const createDeviceSwitch = (name) => {
  const device = new Device({ 'xsi:type': 'topo:Switch', name })

  const ports = genPorts(name)
  device.addChildren(ports)

  const deviceTarget = createDeviceTarget(SWITCH)
  device.addChild(deviceTarget)

  return device
}

// create ES device
const createDeviceMDU = (deviceName, position) => {
  const device = new Device({ 'xsi:type': 'topo:EndSystem', name: deviceName })

  const ports = genPorts(deviceName)
  device.addChildren(ports)

  config.applications.forEach((applicationName) => {
    const appCode = config.getAppCode(applicationName)
    const partition = createPartition(applicationName, deviceName)

    const portsConfig = config.getAppPortsCfg(applicationName)
    const { rows, header } = data.getAppDataByCfg({ position, application: applicationName, config: portsConfig })

    const portTypesHash = data.getAppPortTypesHash({position, application: applicationName})

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

     // Port type & Port queue size
     let portType = config.defaultDataPortType
     let portQueueSize = config.defaultDataPortSize
     if (!portTypesHash) {
       portType = portTypesHash[vlLink][maxPayloadSize].type
       portQueueSize = portTypesHash[vlLink][maxPayloadSize].queue
     }
     const buffer = createBuffer(portType, portQueueSize)

      dataPort.addChild(buffer)

      partition.addChild(dataPort)
    })

    device.addChild(partition)
  })

  const deviceTarget = createDeviceTarget(config.getTarget(deviceName) || TARGET)
  device.addChild(deviceTarget)

  const hostInterface = createHostInterface(`${deviceName}_PHOST`)
  const macInterface = createMacInterface(`${deviceName}_MAC`, config.getMac(deviceName, position))

  hostInterface.addChild(macInterface)
  device.addChild(hostInterface)

  return device
}

// create network device
const createDeviceNETWORK = (deviceName, position) => {
  const device = new Device({ 'xsi:type': 'topo:EndSystem', name: deviceName })

  const ports = genPorts(deviceName)
  device.addChildren(ports)

  config.applications.forEach((applicationName) => {
    const appCode = config.getAppCode(applicationName)
    const partition = createPartition(applicationName, deviceName)

    const portsConfig = config.getAppPortsCfg(applicationName)
    const { rows, header } = data.getAppDataByCfg({ position, application: applicationName, config: portsConfig })

    const portTypesHash = data.getAppPortTypesHash({position, application: applicationName})

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

      // Port type & Port queue size
      let portType = config.defaultDataPortType
      let portQueueSize = config.defaultDataPortSize
      if (!portTypesHash) {
        portType = portTypesHash[vlLink][maxPayloadSize].type
        portQueueSize = portTypesHash[vlLink][maxPayloadSize].queue
      }
      const buffer = createBuffer(portType, portQueueSize)

      dataPort.addChild(buffer)

      partition.addChild(dataPort)
    })

    device.addChild(partition)
  })

  const deviceTarget = createDeviceTarget(config.getTarget(deviceName) || FREGAT)
  device.addChild(deviceTarget)

  const hostInterface = createHostInterface(`${deviceName}_PHOST`)
  const macInterface = createMacInterface(`${deviceName}_MAC`, config.getMac(deviceName, position))

  hostInterface.addChild(macInterface)
  device.addChild(hostInterface)

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
