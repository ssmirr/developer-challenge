#!/bin/bash

# This script is used to deploy the application to the server.

# get deployment domain from the first argument
DEPLOY_DOMAIN=$1
cd ..

# rsync copy backend files to the server
rsync -og --usermap=*:nobody -azP --delete --exclude="backend/node_modules/" backend root@$DEPLOY_DOMAIN:.

# run npm install on the server and start the process
ssh root@$DEPLOY_DOMAIN -tt << EOF
cd backend
npm ci
pm2 delete kaleido
pm2 start index.js --name kaleido
exit
EOF

# build frontend
cd frontend
npm ci
npm run build

rsync -og --usermap=*:nobody -azP --delete build root@$DEPLOY_DOMAIN:.

# restart nginx
ssh root@$DEPLOY_DOMAIN -tt << EOF
rm -rf /www/kaleido
mv build /www/kaleido
exit
EOF

# copy nginx config file to the server
cd ../deploy

ssh root@$DEPLOY_DOMAIN -tt << EOF
rm -rf /etc/nginx/sites-enabled/kaleido
rm -rf /etc/nginx/sites-available/kaleido
exit
EOF

scp ./kaleido.conf root@$DEPLOY_DOMAIN:/etc/nginx/sites-available/kaleido

# restart nginx
ssh root@$DEPLOY_DOMAIN -tt << EOF
ln -s /etc/nginx/sites-available/kaleido /etc/nginx/sites-enabled/kaleido
nginx -t
systemctl restart nginx
exit
EOF

# todo: ensure node is installed
# todo: install certbot and configure ssl
# todo: configure firewall
