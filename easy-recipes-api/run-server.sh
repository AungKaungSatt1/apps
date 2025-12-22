echo "Starting MongoDB..."
mongod --config /etc/mongod.conf &
sleep 2
grep -i "error" /var/log/mongodb/mongod.log

mongosh --eval "rs.initiate()"

until mongosh --eval "print(\"MongoDB is ready\")" > /dev/null 2>&1; do
    echo "Waiting for MongoDB to be ready..."
    sleep 2
done

echo "Starting Node.js application..."
nodemon index.js
