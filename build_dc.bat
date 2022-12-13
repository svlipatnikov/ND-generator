SET POS_CODE=%1
SET TTE_BUILD="C:\TTTech\TTE\TTE-Build\5.2.5\TTEbuild_batch.exe"

CD TTE_DATA\CONFIG_%POS_CODE%

%TTE_BUILD% -commands "TTE.Multigenerate;NC_AFDX_CONFIG_%POS_CODE%.network_config;TARGET|NETWORK"

CD ..\..