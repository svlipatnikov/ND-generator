const Element = require('../entities/Element')

const SAMPLING = 'Sampling'
const QUEUEING = 'Queueing'

class Buffer extends Element {
  constructor(type) {
    super('buffer', { 'xsi:type': `buf:${type}Buffer` })
  }
}

const createSamplingBuffer = () => new Buffer(SAMPLING)

const createQueueingBuffer = (bufferDepth) => {
  const buffer = new Buffer(QUEUEING)
  buffer.addAttributes({ bufferDepth })
  return buffer
}

const createBuffer = (type, queue) => {
  try {
    if (type === SAMPLING) return createSamplingBuffer()
    if (type === QUEUEING && Number(queue) > 0) return createQueueingBuffer(queue)
    throw new Error('')
  } catch (err) {
    console.log('ERROR in createBuffer: ', type, queue)
  }
}

module.exports = { Buffer, createBuffer }
