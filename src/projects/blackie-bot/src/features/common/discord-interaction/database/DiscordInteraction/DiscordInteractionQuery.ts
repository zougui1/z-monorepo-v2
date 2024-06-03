import escapeRegex from 'escape-string-regexp';
import type { SetOptional } from 'type-fest';

import { DiscordInteraction } from './DiscordInteraction';

export class DiscordInteractionQuery {
  readonly #model: DiscordInteraction.Model;

  constructor(model: DiscordInteraction.Model) {
    this.#model = model;
  }

  create = async (discordInteraction: Omit<DiscordInteraction, 'creationDate'>): Promise<DiscordInteraction.Object> => {
    const document = await this.#model.create(discordInteraction);
    return document?.toObject();
  }

  findByMessageId = async (messageId: string): Promise<DiscordInteraction.Object | undefined> => {
    const document = await this.#model.findOne({ messageId });
    return document?.toObject();
  }
}
