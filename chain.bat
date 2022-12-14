SET POS_CODE=%1

CALL clear.bat %POS_CODE%
CALL plan.bat %POS_CODE%
CALL build_dc.bat %POS_CODE%
CALL build_bin.bat %POS_CODE%

CALL copy_to_delivery.bat %POS_CODE%
