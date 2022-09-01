const Device = require('../entities/Device')
const { getCellValue } = require('../helpers')
const { createDeviceTarget, TARGET, FREGAT, SWITCH } = require('../entities/DeviceTarget')
const { createHostInterface } = require('../entities/HostInterface')
const { createMacInterface } = require('../entities/MacInterface')
const { createPartition } = require('../entities/Partition')
const { createDataPort } = require('../entities/DataPort')
const { createBuffer, SAMPLING } = require('../entities/Buffer')
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
const createDeviceES = (deviceName, position) => {
  const MIRROR = deviceName === 'NETWORK'
  const device = new Device({ 'xsi:type': 'topo:EndSystem', name: deviceName })

  const ports = genPorts(deviceName)
  device.addChildren(ports)

  config.applications.forEach((applicationName) => {
    const appCode = config.getAppCode(applicationName)
    const partition = createPartition(applicationName, deviceName)

    const portsConfig = config.getAppPortsCfg(applicationName)
    const { rows, header } = data.getAppDataByCfg({ position, application: applicationName, config: portsConfig })

    const portTypesHash = data.getAppPortTypesHash({ position, application: applicationName })

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

      const dataPortIO = (function (isInput, isOutput, MIRROR) {
        if (MIRROR) return isInput ? 'O' : isOutput ? 'I' : undefined
        return isInput ? 'I' : isOutput ? 'O' : undefined
      })(isInput, isOutput, MIRROR)

      const dataPortName = getCellValue({ row, header, name: portsConfig.portName }) || `${dataPortIO}_${appCode}_${afdxPort}`

      if (isOutput && ipSourceAddress && !MIRROR) partition.addAttributes({ ipSourceAddress })

      if (!afdxPort) return

      if (partition.dataPortsSet.has(dataPortName)) return

      const portDirection = (function (isInput, isOutput, MIRROR) {
        if (!isInput && !isOutput) return undefined
        if (MIRROR) return isInput ? 'TxComUdpPort' : 'RxComUdpPort'
        return isInput ? 'RxComUdpPort' : 'TxComUdpPort'
      })(isInput, isOutput, MIRROR)

      const dataPort = createDataPort()
      dataPort.vlLink = vlLink
      dataPort.io = dataPortIO
      dataPort.addAttributes({
        name: dataPortName,
        'xsi:type': `logical:${portDirection}`,
        maxPayloadSize: `${maxPayloadSize} byte`,
        udpSourcePort,
        udpDestinationPort,
        ipDestinationAddress,
      })

      // Port type & Port queue size
      let portType = config.defaultDataPortType
      let portQueueSize = config.defaultDataPortSize

      if (MIRROR && isInput) {
        // all output ports for network - sampling
        portType = SAMPLING
        portQueueSize = 1
      } else if (portTypesHash) {
        try {
          portType = portTypesHash[vlLink][maxPayloadSize].type
          portQueueSize = portTypesHash[vlLink][maxPayloadSize].queue
        } catch (err) {
          console.log('ERROR finding port in portTypesHash: ', vlLink, maxPayloadSize)
        }
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
    deviceMDU: createDeviceES('MDU', position),
    deviceNetwork: createDeviceES('NETWORK', position),
  }
}

module.exports = {
  createDevices,
}
