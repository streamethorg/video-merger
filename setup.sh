#!/bin/bash
#
ORGANIZATION="ethchicago"
EVENT="ethchicago"

# Check if ORGANIZATION and EVENT exist
if [ -z "$ORGANIZATION" ] || [ -z "$EVENT" ]; then
  echo "Error: ORGANIZATION and/or EVENT variables are not set."
  exit 1
fi

curl -L -o ./public/stream.mp4 "$1"

curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/sessions" >./public/json/sessions.json
echo "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/sessions"

# Convert seconds to HH:MM:SS format
seconds_to_hms() {
  local total_seconds="$1"
  local hours=$((total_seconds / 3600))
  local minutes=$(((total_seconds % 3600) / 60))
  local seconds=$((total_seconds % 60))
  printf "%02d:%02d:%02d" "$hours" "$minutes" "$seconds"
}

JSON_FILE="./public/json/sessions.json" # Replace this with your directory path if different
# SPLITTING THE VIDEO INTO CLIPS
jq -c '.[]' "$JSON_FILE" | while read -r session; do
  STREAM_URL=$(echo "$session" | jq -r .source.streamUrl)

  if [ "$STREAM_URL" != "null" ]; then
    ID=$(echo "$STREAM_URL" | awk -F '/' '{print $(NF-1)}')  # Extract ID from the URL
    MP4_URL=$(echo "$STREAM_URL" | sed 's/index.m3u8/1080p0.mp4/')  # Convert streamUrl to target .mp4 instead of .m3u8
    OUTPUT_VIDEO_FILE="./public/$ID.mp4"  # Output .mp4 file path

    # Check if the MP4 video already exists
    if [ ! -f "$OUTPUT_VIDEO_FILE" ]; then
      echo "Video file for $ID does not exist. Downloading..."
      curl -L -o "$OUTPUT_VIDEO_FILE" "$MP4_URL"
    else
      echo "Video file for $ID already exists. Skipping download."
    fi
  else
    echo "streamUrl is null. Skipping..."
  fi

  # Extract necessary fields from the JSON using the `jq` utility
  VIDEO_NAME=$(echo "$session" | jq -r .id)
  STARTX=$(echo "$session" | jq -r .source.start)
  ENDX=$(echo "$session" | jq -r .source.end)
  START=$(seconds_to_hms "$STARTX"-10)
  END=$(seconds_to_hms "$ENDX"-"$STARTX")

  OUTPUT_FILE="./public/videos/$VIDEO_NAME.mp4" # Naming the output file with the extracted ID and .mp4 extension

  # CHECK IF THE video EXISTS, if it does skip this
  if [ -f "$OUTPUT_FILE" ]; then
    echo "Warning: $OUTPUT_FILE already exists. Skipping..."
    continue
  fi

  # Check if start and end times are valid
  if [[ "$START" == "null" || "$END" == "null" ]]; then
    echo "Warning: Invalid start or end time in $json_file. Skipping..."
    continue
  fi

  # Run the ffmpeg command
  echo "$session" | jq .source
  ffmpeg -ss "$START" -i "./public/$ID.mp4" -t "$END" -c copy -y "$OUTPUT_FILE" > /dev/null 2>&1
done

# LOAD WEBPAGE
npx remotion lambda sites create src/index.ts --site-name=$EVENT

# FOR EACH VIDEO IN THE DIRECTORY
for f in ./public/videos/*.mp4; do
  # REMOVE MP4 from video name
  FILENAME=$(basename "$f" .mp4)
  ID=$(echo "$FILENAME" | sed 's/_/-/g')
  npx remotion lambda render "https://remotionlambda-useast1-piu9hy1rzf.s3.us-east-1.amazonaws.com/sites/funding_the_commons_berlin_2023/index.html" --function-name "remotion-render-4-0-27-mem2048mb-disk2048mb-900sec" $ID
done
