const Device = require('../entities/Device')
const { getCellValue } = require('../helpers')
const { createDeviceTarget, FREGAT, SWITCH } = require('../entities/DeviceTarget')
const { createHostInterface } = require('../entities/HostInterface')
const { createMacInterface } = require('../entities/MacInterface')
const { createPartition } = require('../entities/Partition')
const { createDataPort } = require('../entities/DataPort')
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

  config.applications.forEach((application) => {
    const appCode = config.getAppCode(application)
    const partition = createPartition(application, deviceName)

    const portsConfig = config.getAppPortsCfg(application)
    const { rows, header } = data.getAppDataByCfg({ position, application, config: portsConfig })

    if (!rows?.length) throw new Error(`Ports not found for application "${application}"`)

    rows.forEach((row) => {
      const [outputColumn, outputValue] = Object.entries(portsConfig.isOutput)[0]
      const output = outputValue === '#pos' ? position : outputValue
      const isOutput = getCellValue({ row, header, name: outputColumn }) === output

      const [inputColumn, inputValue] = Object.entries(portsConfig.isInput)[0]
      const input = inputValue === '#pos' ? position : inputValue
      const isInput = getCellValue({ row, header, name: inputColumn }) === input

      const ipSourceAddress = getCellValue({ row, header, name: portsConfig.ipSourceAddress })
      const udpSourcePort = getCellValue({ row, header, name: portsConfig.udpSourcePort })
      const ipDestinationAddress = getCellValue({ row, header, name: portsConfig.ipDestinationAddress })
      const udpDestinationPort = getCellValue({ row, header, name: portsConfig.udpDestinationPort })
      const maxPayloadSize = getCellValue({ row, header, name: portsConfig.maxPayloadSize })
      const portType = getCellValue({ row, header, name: portsConfig.portType })
      const portQueueSize = getCellValue({ row, header, name: portsConfig.portQueueSize })
      const vlLink = getCellValue({ row, header, name: portsConfig.vlLink })
      const afdxPort = isOutput ? udpSourcePort : isInput ? udpDestinationPort : undefined

      const dataPortIO = (function (isInput, isOutput, MIRROR) {
        if (MIRROR) return isInput ? 'O' : isOutput ? 'I' : undefined
        return isInput ? 'I' : isOutput ? 'O' : undefined
      })(isInput, isOutput, MIRROR)

      const dataPortName = getCellValue({ row, header, name: portsConfig.portName }) || `${dataPortIO}_${appCode}_${afdxPort}`

      if (isOutput && ipSourceAddress) {
        partition.addAttributes({ ipSourceAddress: MIRROR ? config.networkSourceIp : ipSourceAddress })
      }

      if (partition.dataPortsSet.has(dataPortName)) return

      const portDirection = (function (isInput, isOutput, MIRROR) {
        if (!isInput && !isOutput) return undefined
        if (MIRROR) return isInput ? 'TxComUdpPort' : 'RxComUdpPort'
        return isInput ? 'RxComUdpPort' : 'TxComUdpPort'
      })(isInput, isOutput, MIRROR)

      const dataPort = createDataPort({
        portDirection,
        vlLink,
        dataPortIO,
        dataPortName,
        maxPayloadSize,
        udpSourcePort,
        udpDestinationPort,
        ipDestinationAddress,
        portType,
        portQueueSize,
        MIRROR,
      })

      if (dataPort) {
        partition.addChild(dataPort)
      }
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
    deviceMDU: createDeviceES('TARGET', position),
    deviceNetwork: createDeviceES('NETWORK', position),
  }
}

module.exports = {
  createDevices,
}
