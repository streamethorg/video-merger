import { join } from 'path';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { webpackOverride } from '../webpack-override';
import { RenderMediaOnProgress } from '@remotion/renderer';

let lastProgressPrinted = -1;

const onProgress: RenderMediaOnProgress = ({ progress }) => {
  const progressPercent = Math.floor(progress * 100);

  if (progressPercent > lastProgressPrinted) {
    console.log(`Rendering is ${progressPercent}% complete`);
    lastProgressPrinted = progressPercent;
  }
};

const start = async () => {
  console.log('Find compositions...');
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
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
        videoBitrate: '500M',
        onProgress,
      });
    }
  }
};
start()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
