import readline from 'readline';
import { exec } from 'child_process';
import fs from 'fs';
import util from 'util';

// Promisify exec for async/await usage
const execPromisified = util.promisify(exec);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Path to your JSON file
const dataFile = './public/json/sessions.json';
const outputFile = './public/json/updatedData.json';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

async function run() {
    const id = await question('Enter the ID to update: ');

    // Find the item by its ID
    const item = data.data.find((i: any) => i.id === id);

    if (!item) {
        console.error(`Item with ID "${id}" not found.`);
        rl.close();
        return;
    }

    const videoPath = await question('Enter the path to the video file: ');
    const start = Number(await question('Enter the starting timestamp (in seconds): '));
    const end = Number(await question('Enter the ending timestamp (in seconds): '));

    // Convert timestamps to frames
    const totalFramesResult = await execPromisified(`ffprobe -v error -select_streams v -show_entries stream=nb_frames -of default=noprint_wrappers=1:nokey=1 ${videoPath}`);
    const totalFrames = parseInt(totalFramesResult.stdout.trim(), 10);

    const durationResult = await execPromisified(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoPath}`);
    const duration = parseFloat(durationResult.stdout.trim());

    const fps = totalFrames / duration;

    item.startFrame = Math.round(start * fps);
    item.endFrame = Math.round(end * fps);
    item.videoPath = videoPath;

    // Write the updated data back to the file
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

    console.log(`Item with ID "${id}" updated.`);
    rl.close();
}

function question(query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
}

run();
