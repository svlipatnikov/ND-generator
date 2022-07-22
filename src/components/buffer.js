const Element = require('../entities/Element')

const createSamplingBuffer = () => new Element('buffer', { 'xsi:type': 'buf:SamplingBuffer' })

const createQueueingBuffer = (bufferDepth) => new Element('buffer', { 'xsi:type': 'buf:QueueingBuffer', bufferDepth })

module.exports = { createQueueingBuffer, createSamplingBuffer }
