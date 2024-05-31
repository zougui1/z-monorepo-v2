import { start, end, cancel, stats } from './commands';
import { CommandGroup } from '../../discord';

export const fap = new CommandGroup('fap', 'Fap commands');

fap.addSubCommand(start);
fap.addSubCommand(end);
fap.addSubCommand(cancel);
fap.addSubCommand(stats);
