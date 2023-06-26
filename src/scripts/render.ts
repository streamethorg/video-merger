import { join } from 'path';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { webpackOverride } from '../webpack-override';

const start = async () => {
  console.log('Find compositions...');
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  });

  console.log('Fetching comps...');
  const compositions = await getCompositions(bundled);

  if (compositions) {
    console.log('Rendering animations...');

    for (const composition of compositions) {
      await renderMedia({
        codec: 'h264',
        composition,
        serveUrl: bundled,
        outputLocation: `out/sessions/${composition.id}.mp4`,
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
