SET POS_CODE=%1

IF NOT EXIST DELIVERY (
  MKDIR DELIVERY
)

IF NOT EXIST DELIVERY\AFDX_Fregat (
  MKDIR DELIVERY\AFDX_Fregat
)

IF NOT EXIST DELIVERY\AFDX_Fregat\%POS_CODE% (
  MKDIR DELIVERY\AFDX_Fregat\%POS_CODE%
) 

COPY /Y TTE_DATA\CONFIG_%POS_CODE%\NETWORK_PERSEUS_COM_RX_V0.h DELIVERY\AFDX_Fregat\%POS_CODE%
COPY /Y TTE_DATA\CONFIG_%POS_CODE%\NETWORK_PERSEUS_COM_TX_V0.h DELIVERY\AFDX_Fregat\%POS_CODE%
COPY /Y TTE_DATA\CONFIG_%POS_CODE%\NETWORK_PERSEUS_COM_RX_V0.hex DELIVERY\AFDX_Fregat\%POS_CODE%
COPY /Y TTE_DATA\CONFIG_%POS_CODE%\NETWORK_PERSEUS_COM_TX_V0.hex DELIVERY\AFDX_Fregat\%POS_CODE%
COPY /Y TTE_DATA\CONFIG_%POS_CODE%\NETWORK_PERSEUS_MAC_2P_8ss.hex DELIVERY\AFDX_Fregat\%POS_CODE%

IF NOT EXIST DELIVERY\AFDX_Target (
  MKDIR DELIVERY\AFDX_Target
)

COPY /Y TTE_DATA\CONFIG_%POS_CODE%\MDU.h DELIVERY\AFDX_Target\tte_es_conf_%POS_CODE%.h
COPY /Y TTE_DATA\CONFIG_%POS_CODE%\MDU.bin DELIVERY\AFDX_Target\tte_es_conf_%POS_CODE%.bin
