const Element = require('../entities/Element')

const TARGET = 'TTE_ES_A664_Pro_PMC'
const FREGAT = 'TTE_ES_A664_T_XMC_F'
const SWITCH = 'TTE_Switch_A664_Lab'

class DeviceTarget extends Element {
  constructor (device) {
    super('deviceTarget', {
      href: `platform:/plugin/com.tttech.ttetools.models.targetdevice/data/${device}.targetdevice#/`,
    })
  }
}

const getTargetDevice = (target) => {
  switch (target) {
    case 'TARGET':
      return TARGET

    case 'SWITCH':
      return SWITCH

    case 'FREGAT':
      return FREGAT

    default:
      return target
  }
}

const createDeviceTarget = (target) => {
  const device = getTargetDevice(target)

  return new DeviceTarget(device)
}

module.exports = { createDeviceTarget, TARGET, FREGAT, SWITCH }
