RMDIR /S /Q DELIVERY

node index-gen-nd.js

CALL chain.bat BVS3
CALL chain.bat BVS4

node index-gen-x2p.js

node index-gen-fregat.js
