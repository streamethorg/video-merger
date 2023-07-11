import { createClient, studioProvider } from '@livepeer/react';
import { createReadStream, readdirSync } from 'fs';
import path from 'path';

if (!process.env.LIVEPEER_APIKEY) {
  console.error('process.env.LIVEPEER_APIKEY is not defined');
}

export async function uploadAsset() {
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
    const asset = await provider.createAsset({
      sources: [
        {
          name: videoName,
          file: stream,
          storage: {
            ipfs: true,
            metadata: {
              name: videoName,
            },
          },
        },
      ],
    });

    console.log(`Uploaded asset ${videoName}`);
  }
}
