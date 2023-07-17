#!/bin/bash

echo "${1}"

yarn install
mkdir -p ./public/videos/
curl -L -o ./public/videos/stream.mp4 "${1}"
yarn render
yarn uploadVideo
