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

export interface MiddlewareContext<I extends ReplyableInteraction = ReplyableInteraction> {
  interaction: I;
  // TODO
  reply: unknown;
  options?: unknown;
}

export type Middleware<I extends ReplyableInteraction = ReplyableInteraction> = (context: MiddlewareContext<I>) => void | Promise<void>;
