# Start Nginx
service nginx start

# Start MongoDB
mongosh --config /etc/mongod.conf &

# Sleep for a few seconds
sleep 3

# Run your Node.js application
nodemon index.js