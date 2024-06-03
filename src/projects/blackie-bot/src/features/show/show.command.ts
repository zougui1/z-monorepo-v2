import { createSeason, watchStart, watchEnd, watchStats } from './commands';
import { CommandGroup } from '../../discord';

export const show = new CommandGroup('show', 'Show commands');

show.addSubCommand(createSeason);
show.addSubCommand(watchStart);
show.addSubCommand(watchEnd);
show.addSubCommand(watchStats);
