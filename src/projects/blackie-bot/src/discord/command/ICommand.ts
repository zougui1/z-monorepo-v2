import type {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Middleware } from '../types';
import { InteractionHandler } from '../InteractionHandlerSet';

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly subInteractionHandlers: InteractionHandler[];

  pre(...middlewares: Middleware[]): this;
  post(...middlewares: Middleware[]): this;
  toObject(): ChatInputApplicationCommandData;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
