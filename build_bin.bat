SET POS_CODE=%1

SET TTE_BUILD="C:\TTTech\TTE\TTE-Build\5.2.5\TTEbuild_batch.exe"

CD TTE_DATA\CONFIG_%POS_CODE%
FOR %%i in (*.device_config) do (
  %TTE_BUILD% -commands "Convert.DcToHex;%%i"
  %TTE_BUILD% -commands "Convert.DcToBin;%%i"
)
CD ..\..
