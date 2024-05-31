import { nanoid } from 'nanoid';
import type { Constructor } from 'type-fest';
import type { Interaction } from 'discord.js';

import { CommandResponse } from '../command/CommandResponse';
import type { ComponentBuilder, ComponentAction, ComponentCreator, ComponentActionContext } from './types';
import type { ComponentInteraction } from '../types';
import type { InteractionHandler, InteractionType } from '../InteractionHandlerSet';

// class Action as base for Command and BaseComponent

export abstract class BaseComponent<
  I extends ComponentInteraction = ComponentInteraction,
  Builder extends ComponentBuilder = ComponentBuilder,
  Options extends Record<string, any> = {},
> implements InteractionHandler<I> {
  readonly interactionType: InteractionType;
  readonly name: string;
  readonly #Builder: Constructor<Builder>;
  #action: ComponentAction<I> | undefined;
  #creator: ComponentCreator<Options, Builder> | undefined;

  constructor(type: InteractionType, Builder: Constructor<Builder>, name: string) {
    this.interactionType = type;
    this.name = name;
    this.#Builder = Builder;
  }

  action = (callback: ComponentAction<I>): this => {
    this.#action = callback;
    return this;
  }

  onCreate<Options extends Record<string, any> = {}>(creator: ComponentCreator<Options, Builder>): BaseComponent<I, Builder, Options> {
    const newThis = this as unknown as BaseComponent<I, Builder, Options>;
    newThis.#creator = creator;
    return newThis;
  }

  validate(): boolean {
    return Boolean(this.#action) && Boolean(this.#creator);
  }

  create(options: Options): Builder {
    if (!this.#creator) {
      throw new Error(`Component ${this.name} of type ${this.interactionType} is missing a creator`);
    }

    const builder = new this.#Builder().setCustomId(this.name);
    return this.#creator({ builder, options });
  }

  abstract isValidInteractionType(interaction: Interaction): interaction is I;

  canHandle = (interaction: I): boolean => {
    return interaction.customId === this.name;
  }

  handle = async (interaction: I): Promise<void> => {
    if (!this.#action) {
      throw new Error(`Component ${this.name} has no action`);
    }

    await this.#action({
      interaction,
      response: new CommandResponse(interaction),
    });
  }
}
