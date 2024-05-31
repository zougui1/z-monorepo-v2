import { MiddlewareContext } from '../discord';

export const authorizer = (options: AuthorizerOptions) => {
  return ({ interaction }: MiddlewareContext): void => {
    if (options.authorizedUserIds.includes(interaction.user.id)) {
      return;
    }

    const unauthorizedError = new Error('You are not authorized to do this action');

    if (!interaction.isCommand() || !options.publicCommands) {
      throw unauthorizedError;
    }


    const allowedCommandOrSubCommands = options.publicCommands[interaction.commandName];

    if (allowedCommandOrSubCommands === true) {
      return;
    }

    if (!allowedCommandOrSubCommands) {
      throw unauthorizedError;
    }

    const subCommandName = interaction.options.getSubcommand(false);

    if (!subCommandName || !allowedCommandOrSubCommands.includes(subCommandName)) {
      throw unauthorizedError;
    }
  }
}

export interface AuthorizerOptions {
  authorizedUserIds: string[];
  publicCommands?: Record<string, boolean | string[]> | undefined;
}
