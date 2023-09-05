#!/bin/bash

# Check if ORGANIZATION and EVENT exist
if [ -z "$ORGANIZATION" ] || [ -z "$EVENT" ]; then
  echo "Error: ORGANIZATION and/or EVENT variables are not set."
  exit 1
fi

# Check if URL is provided
if [ -z "$1" ]; then
  echo "Error: No URL provided."
  exit 1
fi

curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/sessions" > ./public/json/sessions.json

yarn
mkdir -p ./public/videos/

echo "Downloading from URL: ${1}"
curl -L -o ./public/videos/stream.mp4 "${1}"

yarn renderAndUpload
