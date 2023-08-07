import { createClient, studioProvider } from '@livepeer/react';
import { createReadStream, readdirSync } from 'fs';
import path from 'path';
import fs from 'fs';
import toml from 'toml';

const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));

const event = config.event;

if (!process.env.LIVEPEER_APIKEY) {
    console.error('process.env.LIVEPEER_APIKEY is not defined');
}

async function uploadAsset() {
    const { provider } = createClient({
        provider: studioProvider({
            apiKey: process.env.LIVEPEER_APIKEY ?? '',
        }),
    });

    const files = readdirSync('out/sessions/');

    console.log(`Files in out/sessions/:`);
    for (const file of files) {
        console.log(file);
    }

    for (const filePath of files) {
        console.log('Uploading asset..');
        const videoName = path.basename(filePath, '.mp4');
        const stream = createReadStream(`out/sessions/${filePath}`);
        await provider.createAsset({
            sources: [
                {
                    name: `${event}-${videoName}`,
                    file: stream,
                    storage: {
                        ipfs: true,
                        metadata: {
                            name: `${event}-${videoName}`,
                        },
                    },
                },
            ],
        });

        console.log(`Uploaded asset ${videoName}`);
    }
}

uploadAsset();
