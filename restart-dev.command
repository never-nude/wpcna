#!/bin/bash
# Double-click to restart the WPCNA dev server.
cd "$(dirname "$0")"
echo "Stopping any process on port 8080..."
lsof -ti:8080 | xargs -r kill -9 2>/dev/null
sleep 1
echo "Starting eleventy dev server..."
exec npm start
