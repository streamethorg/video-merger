import { join } from 'path';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';
import { webpackOverride } from '../webpack-override';
import fetch from 'cross-fetch';

const start = async () => {
  console.log('Find compositions...');
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  });

  const compositions = await getCompositions(bundled);
  const sessionComp = compositions.find((c) => c.id === 'session');
  const breakComp = compositions.find((c) => c.id === 'still-break');
  const stillhd = compositions.find((c) => c.id === 'still-hd');
  const stillSocial = compositions.find((c) => c.id === 'still-social');
  const stillSponsor = compositions.find((c) => c.id === 'still-sponsors');
  const sponsorComp = compositions.find((c) => c.id === 'sponsors');

  if (breakComp) {
    console.log('Render break..');
    await renderStill({
      composition: breakComp,
      serveUrl: bundled,
      output: 'out/break.png',
    });
  }

  if (sponsorComp && stillSponsor) {
    console.log('Render sponsor assets..');
    await renderStill({
      composition: stillSponsor,
      serveUrl: bundled,
      output: 'out/sponsors.png',
    });

    await renderMedia({
      codec: 'h264',
      composition: sponsorComp,
      serveUrl: bundled,
      outputLocation: `out/sponsors.mp4`,
    });
  }

  if (sessionComp && stillhd && stillSocial) {
    console.log('Fetch sessions...');
    const res = await fetch(
      'https://web3privacy-summit.vercel.app/api/sessions',
    );
    const sessions = await res.json();

    for (const session of sessions.data) {
      const { id } = session;
      console.log(`- ${id}`);

      await renderMedia({
        codec: 'h264',
        composition: sessionComp,
        serveUrl: bundled,
        outputLocation: `out/sessions/${id}.mp4`,
        inputProps: { session },
      });

      await renderStill({
        composition: stillhd,
        serveUrl: bundled,
        output: `out/hd/${id}.png`,
        inputProps: { session },
      });

      await renderStill({
        composition: stillSocial,
        serveUrl: bundled,
        output: `out/social/${id}.png`,
        inputProps: { session },
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
