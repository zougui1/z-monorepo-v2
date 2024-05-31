import type { Interaction } from 'discord.js';

export class InteractionHandlerSet {
  #set: Set<InteractionHandler> = new Set();

  add = (...handlers: InteractionHandler[]): this => {
    for (const handler of handlers) {
      this.#set.add(handler);
    }

    return this;
  }

  handle = async (interaction: Interaction): Promise<void> => {
    let interactionType: InteractionType | undefined;

    for (const handler of this.#set.values()) {
      if (!handler.isValidInteractionType(interaction)) {
        continue;
      }

      interactionType = handler.interactionType;

      if (handler.canHandle(interaction)) {
        await handler.handle(interaction);
        return;
      }
    }

    if (!interactionType) {
      throw new Error('Invalid interaction type');
    }

    throw new Error(`No handler found for interaction of type ${interactionType}`);
  }
}

export interface InteractionHandler<T extends Interaction = Interaction> {
  interactionType: InteractionType;

  isValidInteractionType(interaction: Interaction): interaction is T;
  canHandle(interaction: Interaction): boolean;
  handle(interaction: T): Promise<void>;
}

export enum InteractionType {
  Autocomplete = 'Autocomplete',
  Command = 'Command',
  StringSelectMenu = 'StringSelectMenu',
  Button = 'Button',
  ModalSubmit = 'ModalSubmit',
}
