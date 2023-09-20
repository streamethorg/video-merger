import { join } from 'path';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { RenderMediaOnProgress } from '@remotion/renderer';
import { webpackOverride } from '../webpack-override';

let lastProgressPrinted = 0;



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
        }
    }
};

start().catch((err) => {
    console.log(err);
    process.exit(1);
});
