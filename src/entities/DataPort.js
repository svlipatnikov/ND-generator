const { stringifyParams } = require('../helpers')
const { createBuffer, SAMPLING } = require('./Buffer')
const Element = require('./Element')
const config = require('../entities/Config')

class DataPort extends Element {
  constructor(name) {
    super('dataPort', { name })
  }

  set vlLink(uniqueVl) {
    this.uniqueVl = uniqueVl
  }

  get vlLink() {
    return this.uniqueVl
  }

  set io(direction) {
    this.direction = direction
  }

  get io() {
    return this.direction
  }

  get name() {
    return this.attributes.name
  }
}

const createDataPort = ({
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
}) => {
  try {
    if (
      !portDirection ||
      !vlLink ||
      !dataPortIO ||
      !dataPortName ||
      !maxPayloadSize ||
      !udpSourcePort ||
      !udpDestinationPort ||
      !ipDestinationAddress ||
      !portType
    ) {
      throw new Error('DATA PORT NOT CREATED:')
    }

    const dataPort = new DataPort(dataPortName)
    dataPort.vlLink = vlLink
    dataPort.io = dataPortIO

    dataPort.addAttributes({
      'xsi:type': `logical:${portDirection}`,
      maxPayloadSize: `${maxPayloadSize} byte`,
      udpSourcePort,
      udpDestinationPort,
      ipDestinationAddress,
    })

    // WARNING - приводит к ошибке инициализации конфигурации если есть фрагментация
    // удалено 11/11/2022
    // all output ports for network - sampling
    // const isOutputNetworkPort = MIRROR && dataPortIO === 'O'
    // const portMode = isOutputNetworkPort ? SAMPLING : portType || config.defaultDataPortType
    // const portFifo = isOutputNetworkPort ? 1 : portQueueSize || config.defaultDataPortSize

    const portMode = portType || config.defaultDataPortType
    const portFifo = portQueueSize || config.defaultDataPortSize

    const buffer = createBuffer(portMode, portFifo)
    dataPort.addChild(buffer)

    return dataPort
  } catch (e) {
    console.log(
      e.message,
      stringifyParams({
        dataPortName,
        portDirection,
        maxPayloadSize,
        udpSourcePort,
        udpDestinationPort,
        ipDestinationAddress,
        portType,
        portQueueSize,
      })
    )
  }
}

module.exports = { DataPort, createDataPort }
