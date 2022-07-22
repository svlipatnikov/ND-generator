const Element = require('../entities/Element')

const createPhysicalLink = ({ name, from, to }) =>
  new Element('physicalLink', {
    name,
    transmissionSpeed: '100Mbps',
    mediaType: 'copper',
    port: `${from} ${to}`,
    cableLength: '5m',
  })

module.exports = { createPhysicalLink }

{
  /* 
<physicalLink 
name="pLink1" 
transmissionSpeed="100Mbps" 
mediaType="copper" 
port="//@device[name='ES_DUXX']/@port[name='ES_DUXX'_P1'] //@device[name='Switch1']/@port[name=' sw1_P1']"
cableLength="3m"
/> 
*/
}
