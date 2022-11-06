const { stringifyParams } = require('../helpers')
const Element = require('./Element')

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
  MIRROR,
  portTypesHash,
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
      !ipDestinationAddress
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
    
    return dataPort
  } catch (e) {
    console.log(
      e.message,
      stringifyParams({ dataPortName, portDirection, vlLink, maxPayloadSize, udpSourcePort, udpDestinationPort, ipDestinationAddress })
    )
  }
}

module.exports = { DataPort, createDataPort }
