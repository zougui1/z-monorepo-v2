import { trim } from '../trim';
import { concat } from '../concat';
import { VideoTimestamp } from '../../utils';

export const sections = async (options: SectionsOptions): Promise<void> => {
  const parts: string[] = [];

  for (const [start, end] of options.sections) {
    const partNumber = parts.length + 1;

    console.log(`trimming part ${partNumber}; start=${start}, end=${end}`);

    parts.push(await trim({
      ...options,
      start,
      end,
      suffix: `part ${partNumber}`,
      reenc: true,
    }));
  }

  console.log(`concatenating ${parts.length} parts`);
  await concat({
    ...options,
    filePaths: parts,
  });
}

export interface SectionsOptions {
  filePath: string;
  sections: [VideoTimestamp.Type, VideoTimestamp.Type][];
  suffix?: string | undefined;
  format?: string | undefined;
  keepAudio?: boolean | undefined;
  speed?: number | undefined;
}
