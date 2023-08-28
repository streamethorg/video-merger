#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: No URL provided."
  exit 1
fi

echo "Downloading from URL: ${1}"

yarn
mkdir -p ./public/videos/
curl -L -o ./public/videos/stream.mp4 "${1}"
yarn renderAndUpload
