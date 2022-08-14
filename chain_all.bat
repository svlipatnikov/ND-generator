RMDIR /S /Q delivery

node index-gen-nd.js

CALL chain.bat DU1
CALL chain.bat DU2
CALL chain.bat DU3
CALL chain.bat DU4
CALL chain.bat DU5

node index-gen-x2p.js

node index-gen-fregat.js
