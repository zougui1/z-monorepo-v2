import {
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

export type ReplyableInteraction = (
  | ChatInputCommandInteraction
  | StringSelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction
);

export type ComponentInteraction = (
  | StringSelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction
);

export interface MiddlewareContext {
  interaction: ReplyableInteraction;
  // TODO
  reply: unknown;
}

export type Middleware = (context: MiddlewareContext) => void | Promise<void>;
