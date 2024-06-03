import createDebug from 'debug';
import chalk from 'chalk';
import type { ChatInputCommandInteraction } from 'discord.js';

import { logCommand } from './logCommand';
import { CommandResponse } from '../CommandResponse';
import type { CommandAction } from '../types';
import { camelCaseKeys } from '../../utils';
import type { Option } from '../../option';
import type { Middleware } from '../../types';

const debug = createDebug('@zougui:discord');

export const executeAction = async (options: ExecuteActionOptions): Promise<void> => {
  const { interaction, action, preMiddlewares, postMiddlewares } = options;
  const values = camelCaseKeys(options.values);
  const response = new CommandResponse(interaction);

  logCommand(interaction);

  try {
    debug(`Executing ${preMiddlewares.length} pre-middlewares`);
    for await (const middleware of preMiddlewares) {
      await middleware({ interaction, options: values, reply: undefined });
    }

    debug('Executing action');
    await action({ interaction, options: values, response });
  } catch (error) {
    debug(chalk.redBright('[ERROR]'), error);

    if (error instanceof Error) {
      // TODO
      await response.sendError(error.message);
    } else {
      // TODO
      await response.sendError('An unknown error occured');
    }
  } finally {
    debug(`Executing ${postMiddlewares.length} post-middlewares`);
    for await (const middleware of postMiddlewares) {
      await middleware({ interaction, options: values, reply: undefined });
    }
  }
}

export interface ExecuteActionOptions {
  interaction: ChatInputCommandInteraction;
  values: Record<string, unknown>;
  action: CommandAction<Record<string, Option>>;
  preMiddlewares: Middleware<ChatInputCommandInteraction>[];
  postMiddlewares: Middleware<ChatInputCommandInteraction>[];
}
