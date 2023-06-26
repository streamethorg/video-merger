import readline from 'readline';
import { exec } from 'child_process';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function trim(url: string): string {
  const match = url.match(/hls\/(.+?)\//);
  return match ? match[1] : '';
}

function writeVideoDataToFile(videoPath: string, fileName: string) {
  exec(
    `ffprobe -v error -select_streams v -show_entries stream=nb_frames -of default=noprint_wrappers=1:nokey=1 ${videoPath}`,
    (err: Error | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }

      const data = {
        fileName,
        frames: parseInt(stdout, 10),
      };

      fs.writeFileSync(
        `./public/json/videoData-${fileName}.json`,
        JSON.stringify(data),
      );

      console.log('Video data saved in videoData.json');
    },
  );
}

rl.question(
  'Enter the video URL (or leave empty if you have a video file): ',
  (url: string) => {
    if (url.trim() !== '') {
      const fileName = trim(url);
      const output = `./public/videos/${fileName}.webm`;

      exec(
        `ffmpeg -i ${url} -c:v libvpx-vp9 -b:v 2M ${output}`,
        (err: Error | null, stdout: string, stderr: string) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }

          console.log(`Video saved as ${output}`);
          writeVideoDataToFile(output, fileName);
        },
      );
    } else {
      rl.question('Enter the path to the video file: ', (videoPath: string) => {
        const fileName = videoPath.split('/').pop()?.split('.')[0];

        if (!fileName) {
          console.error('Invalid video file path');
          rl.close();
          return;
        }

        writeVideoDataToFile(videoPath, fileName);
      });
    }
  },
);
