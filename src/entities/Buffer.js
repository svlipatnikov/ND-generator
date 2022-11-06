const Element = require('../entities/Element')

const SAMPLING = 'Sampling'
const QUEUING = 'Queuing'

const xsiType = {
  [SAMPLING]: 'buf:SamplingBuffer',
  [QUEUING]: 'buf:QueueingBuffer', // typo in TTE Queueing instead Queuing
}

class Buffer extends Element {
  constructor(type) {
    super('buffer', { 'xsi:type': xsiType[type] })
  }
}

const createSamplingBuffer = () => new Buffer(SAMPLING)

const createQueuingBuffer = (bufferDepth) => {
  const buffer = new Buffer(QUEUING)
  buffer.addAttributes({ bufferDepth })
  return buffer
}

const createBuffer = (type, queue = 0) => {
  try {
    if (type === SAMPLING) return createSamplingBuffer()
    if (type === QUEUING && Number(queue) > 0) return createQueuingBuffer(queue)
    throw new Error('unexpected port type')
  } catch (err) {
    console.log('ERROR in createBuffer: ', type, queue, err.message)
  }
}

module.exports = { Buffer, createBuffer, SAMPLING, QUEUING }
