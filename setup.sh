#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: No URL provided."
  exit 1
fi

echo "Downloading from URL: ${1}"

export ORGANIZATION=ethberlin
export EVENT=protocol_berg

curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/sessions" > ./public/json/sessions.json

yarn
mkdir -p ./public/videos/
curl -L -o ./public/videos/stream.mp4 "${1}"
yarn renderAndUpload
