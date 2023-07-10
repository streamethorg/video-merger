import fs from 'fs';
import toml from 'toml';
import { exec } from 'child_process';

const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));

const url = config.url;

function trim(url: string): string {
  const match = url.match(/hls\/(.+?)\//);
  return match ? match[1] : '';
}

if (url.trim() !== '') {
  const output = `./public/videos/stream.mp4`;

  exec(
    `ffmpeg -i ${url} -c:v libx264 ${output}`,
    (err: Error | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }

      console.log(`Video saved as ${output}`);
    },
  );
} else {
  console.error('Invalid URL');
}
