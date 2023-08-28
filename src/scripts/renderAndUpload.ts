import { join } from 'path';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { RenderMediaOnProgress } from '@remotion/renderer';
import { createClient, studioProvider } from '@livepeer/react';
import { createReadStream } from 'fs';
import path from 'path';
import { webpackOverride } from '../webpack-override';

let lastProgressPrinted = 0;

if (!process.env.EVENT) {
    console.error('process.env.EVENT is not defined');
    process.exit(1);
}

if (!process.env.LIVEPEER_APIKEY) {
    console.error('process.env.LIVEPEER_APIKEY is not defined');
    process.exit(1);
}

const { provider } = createClient({
    provider: studioProvider({
        apiKey: process.env.LIVEPEER_APIKEY ?? '',
    }),
});

const onProgress: RenderMediaOnProgress = ({ progress }) => {
    const progressPercent = Math.floor(progress * 100);

    if (progressPercent > lastProgressPrinted) {
        const progressBarLength = 50;
        const numberOfEqualSigns = Math.floor(progress * progressBarLength);
        const numberOfDashes = progressBarLength - numberOfEqualSigns;

        const progressBar = `[${'='.repeat(numberOfEqualSigns)}>${'-'.repeat(
            numberOfDashes,
        )}] ${progressPercent}%`;

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(progressBar);

        lastProgressPrinted = progressPercent;
    }
};

const start = async () => {
    console.log('Find compositions...');
    const bundled = await bundle({
        entryPoint: join(process.cwd(), 'src', 'index.ts'),
        webpackOverride,
    });

    console.log('Fetching compositions...');
    const compositions = await getCompositions(bundled);

    if (compositions) {
        for (const composition of compositions) {
            console.log(`Started rendering ${composition.id}`);

            await renderMedia({
                codec: 'h264',
                composition,
                serveUrl: bundled,
                outputLocation: `out/sessions/${composition.id}.mp4`,
                videoBitrate: '50M',
                onProgress,
            });

            lastProgressPrinted = 0;
            await uploadAsset(`out/sessions/${composition.id}.mp4`);
        }
    }
};

async function uploadAsset(filePath: string) {
    console.log('Uploading asset..');
    const videoName = path.basename(filePath, '.mp4');
    const stream = createReadStream(filePath);
    await provider.createAsset({
        sources: [
            {
                name: `${process.env.EVENT}-${videoName}`,
                file: stream,
                storage: {
                    ipfs: true,
                    metadata: {
                        name: `${process.env.EVENT}-${videoName}`,
                    },
                },
            },
        ],
    });

    console.log(`Uploaded asset ${videoName}`);
}

start().catch((err) => {
    console.log(err);
    process.exit(1);
});
