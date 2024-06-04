
import type { Interaction } from 'discord.js';

import type { InteractionType } from './InteractionType';

export class InteractionHandlerSet {
  set: Set<InteractionHandler> = new Set();

  add = (...handlers: InteractionHandler[]): this => {
    for (const handler of handlers) {
      this.set.add(handler);
    }

    return this;
  }

  handle = async (interaction: Interaction): Promise<void> => {
    for (const handler of this.set.values()) {
      const subHandler = handler.findSubHandler(interaction);

      if (subHandler) {
        return await subHandler.handle(interaction);
      }

      if (!handler.isValidInteractionType(interaction)) {
        continue;
      }


      if (handler.canHandle(interaction)) {
        return await handler.handle(interaction);
      }
    }

    const customId = 'customId' in interaction ? interaction.customId : undefined;

    throw new Error(`No handler found for interaction ID ${customId}`);
  }
}

export abstract class InteractionHandler<T extends Interaction = Interaction> {
  parent: InteractionHandler | undefined;
  abstract readonly name: string;
  abstract readonly subInteractionHandlers?: InteractionHandler[];
  abstract interactionType: InteractionType;

  abstract isValidInteractionType(interaction: Interaction): interaction is T;
  abstract canHandle(interaction: T): boolean;
  abstract handle(interaction: T): Promise<void>;

  connectParent = (parent: InteractionHandler): void => {
    this.parent = parent;
  }

  findSubHandler = (interaction: Interaction): InteractionHandler | undefined => {
    for (const subHandler of this.subInteractionHandlers || []) {
      if (subHandler.isValidInteractionType(interaction) && subHandler.canHandle(interaction)) {
        return subHandler;
      }

      try {
        if (subHandler.canHandle(interaction)) {
          const subSubHandler = subHandler.findSubHandler(interaction);
          return subSubHandler ?? subHandler;
        }
      } catch { }
    }
  }

  getId = (): string => {
    return [
      this.parent?.getId(),
      this.name,
    ].filter(Boolean).join('/');
  }
}
