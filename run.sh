#!/bin/bash

ORGANIZATION="funding_the_commons"
EVENT="funding_the_commons_berlin_2023"

# Check if ORGANIZATION and EVENT exist
if [ -z "$ORGANIZATION" ] || [ -z "$EVENT" ]; then
    echo "Error: ORGANIZATION and/or EVENT variables are not set."
    exit 1
fi

# Convert seconds to HH:MM:SS format
seconds_to_hms() {
    local total_seconds="$1"
    local hours=$((total_seconds / 3600))
    local minutes=$(((total_seconds % 3600) / 60))
    local seconds=$((total_seconds % 60))
    printf "%02d:%02d:%02d" "$hours" "$minutes" "$seconds"
}

JSON_FILE="./public/json/sessions.json"

# Debug: Check JSON record count
record_count=$(jq '. | length' "$JSON_FILE")
echo "Total records in JSON: $record_count"

count=0
mapfile -t sessions < <(jq -c '.[]' "$JSON_FILE")
for session in "${sessions[@]}"; do
    count=$((count+1))
    echo "Processing record $count of $record_count"

    STREAM_URL=$(echo "$session" | jq -r .source.streamUrl)
    if [ "$STREAM_URL" != "null" ]; then
      ID=$(echo "$STREAM_URL" | awk -F '/' '{print $(NF-1)}')
      MP4_URL=$(echo "$STREAM_URL" | sed 's/index.m3u8/1080p0.mp4/')
      OUTPUT_VIDEO_FILE="./public/$ID.mp4"

      if [ ! -f "$OUTPUT_VIDEO_FILE" ]; then
        echo "Video file for $ID does not exist. Downloading..."
        curl -L -o "$OUTPUT_VIDEO_FILE" "$MP4_URL"
      else
        echo "Video file for $ID already exists. Skipping download."
      fi
    else
      echo "streamUrl is null. Skipping..."
    fi

    STARTX=$(echo "$session" | jq -r .source.start)
    ENDX=$(echo "$session" | jq -r .source.end)
    START=$(seconds_to_hms "$STARTX"-10)
    END=$(seconds_to_hms "$ENDX"-"$STARTX")

    echo "$ID, $START, $END"
    OUTPUT_FILE="./public/videos/$ID.mp4"
    if [ -f "$OUTPUT_FILE" ]; then
        echo "Warning: $OUTPUT_FILE already exists. Skipping..."
        continue
    fi

    if [[ "$START" == "null" || "$END" == "null" ]]; then
        echo "Warning: Invalid start or end time for record $count. Skipping..."
        continue
    fi

    ffmpeg -ss "$START" -i "./public/$ID.mp4" -t "$END" -c:v libx264 -c:a aac -y "$OUTPUT_FILE" -preset veryfast > /dev/null 2>&1

    if [ $? -ne 0 ]; then
        echo "ffmpeg failed for $ID on record $count"
    fi
done

# LOAD WEBPAGE
npx remotion lambda sites create src/index.ts --site-name=$EVENT

# FOR EACH VIDEO IN THE DIRECTORY
for f in ./public/videos/*.mp4; do
    FILENAME=$(basename "$f" .mp4)
    ID=$(echo "$FILENAME" | sed 's/_/-/g')
    npx remotion lambda render "https://remotionlambda-useast1-piu9hy1rzf.s3.us-east-1.amazonaws.com/sites/funding_the_commons_berlin_2023/index.html" --function-name "remotion-render-4-0-27-mem2048mb-disk2048mb-900sec" $ID
done
