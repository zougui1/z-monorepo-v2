// istanbul ignore file
import path from 'node:path';

import sharp from 'sharp';
import apng from 'sharp-apng';
import imgHash from 'imghash';
import fs from 'fs-extra';
import { unique, sort } from 'radash';
import chalk from 'chalk';
import leven from 'fast-levenshtein';

import { getCombinations } from '@zougui/common.array-utils';

import { connect, FuraffinitySubmission } from './database';
import { runScraper, runSubmissionDownloader } from './business';
import env from './env';

const bits = 20;

(async () => {
  const dir = '/mnt/Manjaro_Data/zougui/Temp/furry-downloader/temp/hash-test/stretching/t';
  const files = await fs.readdir(dir);

  const hashes = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    return await imgHash.hash(filePath, bits);
  }));

  const areAllEqual = unique(hashes).length === 1;

  if (areAllEqual) {
    console.log(`All ${hashes.length} hashes are equal`);
    console.log('hash:', hashes[0]);
    return;
  }

  const combos = getCombinations(enumerate(hashes), { length: 2 });
  const diffCombos = sort(combos.map(([hashA, hashB]) => {
    return {
      hashA,
      hashB,
      distance: leven.get(hashA.value, hashB.value),
    };
  }), item => item.distance, true);

  for (const { hashA, hashB, distance: distanceNum } of diffCombos) {
    const indexA = chalk.yellow(hashA.index);
    const indexB = chalk.yellow(hashB.index);
    const distance = chalk.blueBright(distanceNum);

    console.group(`Differences between the hash ${indexA} and ${indexB} (edits: ${distance})`);
    console.log(stringDiff(hashA.value, hashB.value));
    console.groupEnd();
  }
});

(async () => {
  await connect(env.database.uri);

  /*await Promise.all([
    Cursor.Model.deleteMany(),
    FuraffinitySubmission.Model.deleteMany(),
    User.Model.deleteMany(),
  ]);*/

  //await runScrapper();
  //await runSubmissionDownloader();

  await Promise.all([
    runScraper(),
    //runSubmissionDownloader(),
  ]);
});

function stringDiff(strA: string, strB: string): string {
  const charsA = strA.split('');
  const charsB = strB.split('');

  const diffing = charsA.map((charA, index) => {
    const charB = charsB[index];
    return { charA, charB, diff: charA !== charB };
  });

  const formatted = diffing.reduce((acc, diffing) => {
    const color = diffing.diff ? chalk.redBright : chalk.greenBright;

    return {
      firstLine: `${acc.firstLine}${color(diffing.charA)}`,
      secondLine: `${acc.secondLine}${color(diffing.charB)}`,
    };
  }, { firstLine: '', secondLine: '' });

  return `${formatted.firstLine}\n${formatted.secondLine}`;
}

function enumerate<T>(arr: T[]): { index: number, value: T }[] {
  return arr.map((value, index) => ({ index, value }));
}
