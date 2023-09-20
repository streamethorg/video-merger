import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ORGANIZATION = "funding_the_commons";
const EVENT = "funding_the_commons_berlin_2023";
const JSON_FILE = './public/json/sessions.json';

// Utility functions
function secondsToHms(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes}:${seconds}`;
}

function fetchSessionsFromApi() {
    const apiUrl = `http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/sessions`;
    console.log(apiUrl);
    const response = execSync(`curl -L -H "Accept: application/json" "${apiUrl}"`);
    fs.writeFileSync(JSON_FILE, response);
}

function processVideos() {
    let sessions = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    
    sessions = sessions.map((session: any) => {
        const start = session.source.start - 10;
        const end = session.source.end - start;
        const id = session.id.replace(/"/g, '').replace(/'/g, '');
        console.log(`${id}, ${secondsToHms(start)}, ${secondsToHms(end)}`);

        const outputFilePath = `./public/videos/${id}.mp4`;

        if (fs.existsSync(outputFilePath)) {
            console.warn(`Warning: ${outputFilePath} already exists. Skipping...`);
            session.split = true;
        } else {
            if (start !== "null" && end !== "null") {
                execSync(`ffmpeg -live_start_index 0 -ss ${secondsToHms(start)} -i "https://lp-playback.com/hls/a2ae5cylmxs38npg/index.m3u8" -ss "00:00:10" -t ${secondsToHms(end)} -c copy -y "${outputFilePath}"`, { stdio: 'ignore' });
                session.split = true;
            } else {
                console.warn(`Warning: Invalid start or end time. Skipping...`);
                session.split = false;
            }
        }
        return session;
    });

    fs.writeFileSync(JSON_FILE, JSON.stringify(sessions, null, 4));
}

function renderVideos() {
    const sessions = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

    sessions.forEach((session: any) => {
        if (session.split) {
            const fileNameWithoutExt = path.basename(session.id, '.mp4');
            const fileNameReplaced = fileNameWithoutExt.replace(/_/g, '-');
            execSync(`npx remotion lambda render "https://remotionlambda-useast1-piu9hy1rzf.s3.us-east-1.amazonaws.com/sites/funding_the_commons_berlin_2023/index.html" --function-name "remotion-render-4-0-27-mem2048mb-disk2048mb-900sec" ${fileNameReplaced}`);
            session.rendered = true;
        }
    });

    fs.writeFileSync(JSON_FILE, JSON.stringify(sessions, null, 4));
}

// Main script logic
if (!ORGANIZATION || !EVENT) {
    console.error("Error: ORGANIZATION and/or EVENT variables are not set.");
    process.exit(1);
}

fetchSessionsFromApi();
processVideos();
renderVideos();

execSync(`npx remotion lambda sites create src/index.ts --site-name=${EVENT}`);
