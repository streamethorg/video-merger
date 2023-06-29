import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dataFile = './public/json/sessions.json';
const outputFile = './public/json/updatedData.json';

const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

async function run() {
  const id = await question('Enter the ID to update: ');

  const item = data.data.find((i: any) => i.id === id);

  if (!item) {
    console.error(`Item with ID "${id}" not found.`);
    rl.close();
    return;
  }

  const videoPath = await question('Enter the path to the video file: ');
  const start = Number(
    await question('Enter the starting timestamp (in seconds): '),
  );
  const end = Number(
    await question('Enter the ending timestamp (in seconds): '),
  );

  item.startCut = start;
  item.endCut = end;
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
