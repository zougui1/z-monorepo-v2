import createDebug from 'debug';
import chalk from 'chalk';
import type { ChatInputCommandInteraction } from 'discord.js';

const debug = createDebug('@zougui:discord');

export const logCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const commandName = chalk.cyan(interaction.commandName);
  const subCommandName = interaction.options.getSubcommand(false);
  const debugMessage = subCommandName
    ? `Executing sub-command ${commandName} ${chalk.cyanBright(subCommandName)}`
    : `Executing command ${commandName}`;

  debug(debugMessage);
}
