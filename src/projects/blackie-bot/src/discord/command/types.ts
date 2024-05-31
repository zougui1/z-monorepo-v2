import type { ChatInputCommandInteraction } from 'discord.js';

import type { CommandResponse } from './CommandResponse';
import type { Option, InferOptionsObject } from '../option';

export interface ActionContext<Options extends Record<string, Option>> {
  interaction: ChatInputCommandInteraction;
  options: InferOptionsObject<Options>;
  response: CommandResponse;
}

export type CommandAction<Options extends Record<string, Option>> = (context: ActionContext<Options>) => void;
