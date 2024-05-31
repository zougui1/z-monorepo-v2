import {
  Interaction,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  type ChatInputApplicationCommandData,
  type ChatInputCommandInteraction,
} from 'discord.js';

import type { AnyCommand, Command } from './Command';
import { CommandMap } from './CommandMap';
import type { ICommand } from './ICommand';
import type { Middleware } from '../types';
import { InteractionHandler, InteractionType } from '../InteractionHandlerSet';

export class CommandGroup implements ICommand, InteractionHandler {
  readonly interactionType = InteractionType.Command;
  readonly name: string;
  readonly description: string;
  readonly subCommands: CommandMap = new CommandMap();
  readonly subInteractionHandlers: InteractionHandler[] = [];
  #preMiddlewares: Middleware[] = [];
  #postMiddlewares: Middleware[] = [];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  // mustbe a generic ICommand that gets casted into AnyCommand
  // due to a type issue with the options' zod schema inference
  // in the command's action
  addSubCommand(command: ICommand): this {
    command.pre(...this.#preMiddlewares);
    command.post(...this.#postMiddlewares);
    this.subInteractionHandlers.push(...command.subInteractionHandlers);
    this.subCommands.add(command as AnyCommand);

    return this;
  }

  pre(...middlewares: Middleware[]): this {
    this.#preMiddlewares.push(...middlewares);
    return this;
  }

  post(...middlewares: Middleware[]): this {
    this.#postMiddlewares.push(...middlewares);
    return this;
  }

  toObject(): ChatInputApplicationCommandData {
    return {
      name: this.name,
      type: ApplicationCommandType.ChatInput,
      description: this.description,
      options: this.subCommands.toArray().map(subCommand => ({
        ...subCommand,
        type: ApplicationCommandOptionType.Subcommand,
      })),
    };
  }

  isValidInteractionType = (interaction: Interaction): interaction is ChatInputCommandInteraction => {
    return interaction.isChatInputCommand();
  }

  canHandle = (interaction: ChatInputCommandInteraction): boolean => {
    return interaction.commandName === this.name;
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subCommandName = interaction.options.getSubcommand(false);

    if (!subCommandName) {
      throw new Error(`no sub-command found for the command "${this.name}"`);
    }

    const subCommand = this.subCommands.get(subCommandName);

    if (!subCommand) {
      throw new Error(`Command "${this.name}" has no sub-command "${subCommandName}"`);
    }

    await subCommand.execute(interaction);
  }

  handle = this.execute;
}
