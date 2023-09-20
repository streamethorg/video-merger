#!/bin/bash
ORGANIZATION="funding_the_commons"
EVENT="funding_the_commons_berlin_2023"

if [ -z "$1" ]; then
  echo "Error: Need a URL of Livepeer."
  exit 1
fi

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
  echo "$session" | jq .source
  # Extract necessary fields from the JSON using the `jq` utility
  STARTX=$(echo "$session" | jq -r .source.start)
  ENDX=$(echo "$session" | jq -r .source.end)
  ID=$(echo "$session" | jq -r .id)
  START=$(seconds_to_hms "$STARTX"-10)
  END=$(seconds_to_hms "$ENDX"-"$STARTX")
  echo "$ID, $START, $END"
  OUTPUT_FILE="./public/videos/$ID.mp4" # naming the output file same as JSON file with .mp4 extension
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

  # Run the ffmpeg comm
  ffmpeg -ss "$START" -i "./public/stream.mp4" -t "$END" -c copy -y "$OUTPUT_FILE" > /dev/null 2>&1
done

# LOAD WEBPAGE
npx remotion lambda sites create src/index.ts --site-name=$EVENT

# FOR EACH VIDEO IN THE DIRECTORY
for f in ./public/videos/*.mp4; do
  # REMOVE MP4 from video name
  FILENAME=$(basename "$f" .mp4)
  ID=$(echo "$FILENAME" | sed 's/_/-/g')
  npx remotion lambda render "https://remotionlambda-useast1-piu9hy1rzf.s3.us-east-1.amazonaws.com/sites/funding_the_commons_berlin_2023/index.html" --function-name "remotion-render-4-0-27-mem2048mb-disk2048mb-900sec" $FILENAME
done
