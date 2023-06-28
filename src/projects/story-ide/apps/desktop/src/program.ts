import path from 'node:path';

import { Command } from 'commander';

import { createApp } from './app';
import { globals } from './globals';

const program = new Command();
program.argument('<path>', 'path at which to ooen the IDE; default = current directory');
program.parseAsync();

const argPath = program.args.at(0);
globals.dir = argPath?.[0] === '/'
  ? argPath
  : path.join(process.cwd(), argPath || '');

createApp(globals.dir)
  .catch(error => console.error(error));
