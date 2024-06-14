import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';

const program = new Command();

program
  .command('no-afk')
  .action(async () => {
    const { startNoAfk } = await import('./commands/no-afk');
    await startNoAfk();
  });

program
  .command('manage-record')
  .option('-u, --url', 'url of OBS websocket server', 'ws://127.0.0.1:4455')
  .requiredOption('-p, --password <password>', 'password of OBS websocket server')
  .option('--record-dir <path>', 'Directory in which to symlink the videos')
  .action(async (options) => {
    const { startManageRecord } = await import('./commands/record');
    await startManageRecord({
      url: options.url,
      password: options.password,
      recordDir: options.recordDir,
    });
  });

program
  .command('test')
  .argument('<path>', 'path to the video')
  .action(async (filePath) => {
    const { deleteVideoIfUnwanted } = await import('./commands/record/utils/deleteVideoIfUnwanted');

    const fileNames = await fs.readdirSync(filePath);

    for await (const fileName of fileNames) {
      console.group(fileName);
      await deleteVideoIfUnwanted(path.join(filePath, fileName));
      console.groupEnd();
      console.log();
    }
  });

program.parseAsync().catch(error => {
  console.error(error);
  process.exit(1);
});
