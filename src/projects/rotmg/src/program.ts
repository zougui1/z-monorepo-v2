import { Command } from 'commander';

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
  .action(async (options) => {
    const { startManageRecord } = await import('./commands/record');
    await startManageRecord({
      url: options.url,
      password: options.password,
    });
  });

program.parseAsync().catch(error => {
  console.error(error);
  process.exit(1);
});
