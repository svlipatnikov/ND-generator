const Element = require('../entities/Element')

const SAMPLING = 'SamplingBuffer'
const QUEUEING = 'QueueingBuffer'

class Buffer extends Element {
  constructor (type) {
    super('buffer', { 'xsi:type': `buf:${type}` })
  }
}

const createSamplingBuffer = () => new Buffer(SAMPLING)

const createQueueingBuffer = (bufferDepth) => {
  const buffer = new Buffer(QUEUEING)
  buffer.addAttributes({bufferDepth})
  return buffer
}

module.exports = { Buffer, createQueueingBuffer, createSamplingBuffer }
