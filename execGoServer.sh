#forever start /root/server/server.js
#/root/.nvm/versions/node/v18.12.1/bin/forever start /root/server/server.js
cd /root/server/
#whoami >> /root/server/provalog.txt 
#pwd >> /root/server/provalog.txt
forever start server.js >> provalog.txt
