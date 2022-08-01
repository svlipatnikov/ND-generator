const { createPort } = require('../entities/Port')

const genPorts = (deviceName) => {
  const port1 = createPort({ name: `${deviceName}_P1`, targetId: 'PHY.1' })
  const port2 = createPort({ name: `${deviceName}_P2`, targetId: 'PHY.2' })

  return [port1, port2]
}

module.exports = { genPorts }
