const Element = require('../entities/Element')

const createDataPort = (name = '') => new Element('dataPort', { name })

module.exports = { createDataPort }

{
  /*
<dataPort	
xsi:type="logical:TxComUdpPort"	
name="A661Server_2020"
maxPayloadSize="44 byte"
udpSourcePort="2020"
udpDestinationPort="2022"
ipDestinationAddress="10.4.68.17">
</dataPort> 
*/
}
