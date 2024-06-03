import { ApplicationCommandDataResolvable, ApplicationCommandOptionType } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

import { isChatInputCommand } from '../../utils';

const debug = createDebug('@zougui:discord');

export const logCreatedCommands = (commands: ApplicationCommandDataResolvable[]): void => {
  for (const command of commands) {
    if (!isChatInputCommand(command)) {
      continue;
    }

    const coloredCommandName = chalk.cyan(command.name);

    debug(`Created command ${coloredCommandName}`);
    const options = command.options || [];
    const areSubCommands = [...options].every(option => option.type === ApplicationCommandOptionType.Subcommand);

    for (const option of options) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        const coloredSubCommandName = chalk.cyanBright(option.name);
        debug(`Created sub-command ${coloredCommandName} ${coloredSubCommandName}`);

        for (const subOption of option.options || []) {
          const typeName = Object.keys(ApplicationCommandOptionType).find(type => {
            return ApplicationCommandOptionType[type as keyof typeof ApplicationCommandOptionType] === subOption.type;
          }) || 'UnknownType';
          const hasAutocomplete = ('autocomplete' in subOption && subOption.autocomplete)
            ? 'autocomplete'
            : '';

          const parts = [
            coloredCommandName,
            coloredSubCommandName,
            chalk.yellow(subOption.name),
            typeName,
            hasAutocomplete,
          ].filter(Boolean).join(' ');

          debug(`Created option ${parts}`);
        }
      } else {
        const typeName = Object.keys(ApplicationCommandOptionType).find(type => {
          return ApplicationCommandOptionType[type as keyof typeof ApplicationCommandOptionType] === option.type;
        }) || 'UnknownType';
        const hasAutocomplete = ('autocomplete' in option && option.autocomplete)
          ? 'autocomplete'
          : '';

        const parts = [
          coloredCommandName,
          chalk.yellow(option.name),
          typeName,
          hasAutocomplete,
        ].filter(Boolean).join(' ');

        debug(`Created option ${parts}`);
      }
    }
  }
}
