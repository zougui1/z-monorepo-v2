import z from 'zod';
import type {
  Interaction,
  AutocompleteInteraction,
  ApplicationCommandOptionData,
  ApplicationCommandSubGroupData,
  ApplicationCommandSubCommandData,
} from 'discord.js';

import { convertOption } from './utils';
import { createDefaultAutocompletion } from './default-autocompletions';
import type { AutocompleteHandler } from '../autocomplete';
import { InteractionHandler } from '../InteractionHandlerSet';
import { InteractionType } from '../InteractionType';
import { tryit } from 'radash';
import chalk from 'chalk';

const maxOptions = 25;

export class Option<
  OptionName extends string = string,
  Schema extends z.Schema = z.Schema,
> extends InteractionHandler {
  readonly interactionType = InteractionType.Autocomplete;
  readonly subInteractionHandlers: undefined;
  readonly name: OptionName;
  readonly description: string;
  isOptional: boolean;
  schema: Schema;
  _autocomplete: AutocompleteHandler | undefined;

  constructor(name: OptionName, description: string, schema: Schema) {
    super();

    this.name = name;
    this.description = description;
    this.schema = schema;
    this.isOptional = schema.isOptional();
    this._autocomplete = createDefaultAutocompletion(schema);
  }

  addTransformer<NewTransformer>(transform: (arg: z.infer<Schema>) => NewTransformer): Option<OptionName, z.ZodEffects<Schema, NewTransformer>>  {
    const newOption = this as any as Option<OptionName, z.ZodEffects<Schema, NewTransformer>>;
    newOption.schema = this.schema.transform(transform);

    return newOption;
  }

  optional(): Option<OptionName, z.ZodOptional<Schema>> {
    const newOption = this as any as Option<OptionName, z.ZodOptional<Schema>>;
    newOption.schema = this.schema.optional();
    newOption.isOptional = true;

    return newOption;
  }

  autocomplete(listener: AutocompleteHandler): this {
    this._autocomplete = listener
    return this;
  }

  toObject(): OptionObject {
    return convertOption(this, this.schema);
  }

  isValidInteractionType = (interaction: Interaction): interaction is AutocompleteInteraction => {
    return interaction.isAutocomplete();
  }

  canHandle = (interaction: AutocompleteInteraction): boolean => {
    return interaction.options.getFocused(true)?.name === this.name;
  }

  handle = async (interaction: AutocompleteInteraction): Promise<void> => {
    if (!this._autocomplete) {
      throw new Error(`The option "${this.name}" has no autocompletion handler`);
    }

    const focusedOption = interaction.options.getFocused(true);

    const [error, maybeOptions] = await tryit(this._autocomplete)({
      interaction,
      value: focusedOption.value,
    });

    if (error) {
      console.error(chalk.redBright('[ERROR]'), error);
      return await interaction.respond([]);
    }

    const options = maybeOptions.slice(0, maxOptions) || [];

    const optionObjects = options.map(option => {
      return typeof option === 'string'
        ? { name: option, value: option }
        : option;
    });

    await interaction.respond(optionObjects);
  }
}

export type OptionObject = Exclude<ApplicationCommandOptionData, ApplicationCommandSubGroupData | ApplicationCommandSubCommandData>;
