const Element = require('../entities/Element')

const TARGET = 'TTE_ES_A664_Pro_PMC'
const FREGAT = 'TTE_EA_A664_T_XMC_F'
const SWITCH = 'TTE_Switch_A664_Lab'

const getTargetDevice = (name) => {
  switch (name) {
    case 'MDU':
      return TARGET

    case 'SWITCH':
      return SWITCH

    case 'NETWORK':
      return FREGAT

    default:
      return name
  }
}

const createDeviceTarget = (name) => {
  const device = getTargetDevice(name)

  return new Element('deviceTarget', {
    href: `platform:/plugin/com.tttech.ttetools.models.targetdevice/data/${device}.targetdevice#/`,
  })
}

module.exports = { createDeviceTarget, TARGET, FREGAT, SWITCH }
