import z from 'zod';
import {
  Interaction,
  ApplicationCommandType,
  type ChatInputApplicationCommandData,
  type ChatInputCommandInteraction,
} from 'discord.js';

import { getRawInteractionOptions, executeAction } from './utils';
import type { ICommand } from './ICommand';
import type { CommandAction } from './types';
import { Option, OptionMap, type OptionObject } from '../option';
import type { Middleware } from '../types';
import { InteractionHandler } from '../InteractionHandlerSet';
import { InteractionType } from '../InteractionType';
import { BaseComponent } from '../component';
import { CommandGroup } from './CommandGroup';

export class Command<Options extends Record<string, Option> = {}> extends InteractionHandler implements ICommand {
  readonly interactionType = InteractionType.Command;
  readonly name: string;
  readonly description: string;
  readonly options: OptionMap<Options> = new OptionMap();
  readonly subInteractionHandlers: InteractionHandler[] = [];
  readonly components: BaseComponent[] = [];
  #action: CommandAction<Options> | undefined;
  #preMiddlewares: Middleware<ChatInputCommandInteraction>[] = [];
  #postMiddlewares: Middleware<ChatInputCommandInteraction>[] = [];

  constructor(name: string, description: string) {
    super();

    this.name = name;
    this.description = description;
  }

  option<
    OptionName extends string,
    Schema extends z.Schema,
  >(
    name: OptionName,
    description: string,
    schema: Schema,
  ): Command<AddOption<Options, OptionName, Schema>> {
    const option = new Option(name, description, schema);
    this.addOption(option);
    return this as any as Command<AddOption<Options, OptionName, Schema>>;
  }

  addOption<O extends Option>(option: O): Command<AddOption<Options, O['name'], O['schema']>> {
    this.options.add(option);
    this.subInteractionHandlers.push(option);
    return this as any as Command<AddOption<Options, O['name'], O['schema']>>;
  }

  addComponent = (component: BaseComponent<any, any, any>): this => {
    this.components.push(component, ...component.subInteractionHandlers);
    return this;
  }

  action(callback: CommandAction<Options>): this {
    this.#action = callback;
    return this;
  }

  pre(...middlewares: Middleware<ChatInputCommandInteraction>[]): this {
    this.#preMiddlewares.push(...middlewares);
    return this;
  }

  post(...middlewares: Middleware<ChatInputCommandInteraction>[]): this {
    this.#postMiddlewares.push(...middlewares);
    return this;
  }

  toObject(): CommandObject {
    return {
      name: this.name,
      description: this.description,
      type: ApplicationCommandType.ChatInput,
      options: this.options.toArray(),
    };
  }

  isValidInteractionType = (interaction: Interaction): interaction is ChatInputCommandInteraction => {
    return interaction.isChatInputCommand();
  }

  canHandle = (interaction: ChatInputCommandInteraction): boolean => {
    const interactionName = interaction.options.getSubcommand(false) ?? interaction.commandName;
    return interactionName === this.name;
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      console.log('Command: interaction.isChatInputCommand')
    }
    if (interaction.isAutocomplete()) {
      console.log('Command: interaction.isAutocomplete')
    }
    if (!this.#action) {
      throw new Error(`Command ${this.name} has no action`);
    }

    const rawOptions = getRawInteractionOptions(interaction, this.options.asArray());
    const schema = this.options.toSchema();
    const result = schema.safeParse(rawOptions);

    if (!result.success) {
      const label = '**Invalid options:**';
      const errors = result.error.errors.map(error => {
        return `- ${error.path.join('.')}: ${error.message}`;
      });
      await interaction.reply(`❌ ${label}\n${errors}`);
      return;
    }

    await executeAction({
      action: this.#action as any,
      values: result.data,
      preMiddlewares: this.#preMiddlewares,
      postMiddlewares: this.#postMiddlewares,
      interaction,
    });
  }

  handle = this.execute;
}

type AddOption<
  Options extends Record<string, Option>,
  OptionName extends string,
  Schema extends z.ZodSchema,
> = Options & Record<OptionName, Option<OptionName, Schema>> extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export type AnyCommand = Command<any>;
export type CommandObject = ChatInputApplicationCommandData & { options: OptionObject[]; };
