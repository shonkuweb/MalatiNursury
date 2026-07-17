#!/bin/sh

# Ensure the database exists in the persistent volume
if [ ! -f /data/dev.db ]; then
  echo "Database not found in /data. Copying default dev.db..."
  cp /app/dev.db /data/dev.db
else
  echo "Persistent database found in /data. Proceeding..."
fi

# Start the Next.js server
exec node server.js
