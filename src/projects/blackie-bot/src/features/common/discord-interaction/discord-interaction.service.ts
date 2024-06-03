import zod from 'zod';

import { DiscordInteraction } from './database';
import { EnvType } from '../../../EnvType';

export class DiscordInteractionService {
  protected readonly query: DiscordInteraction.Query;

  constructor(envType: EnvType) {
    this.query = envType === EnvType.Production ? DiscordInteraction.Prod : DiscordInteraction.Dev;
  }

  create = async (discordInteraction: Omit<DiscordInteraction.Object, '_id' | 'creationDate'>): Promise<DiscordInteraction.Object> => {
    return this.query.create(discordInteraction);
  }

  findByMessageId = async <T extends zod.Schema>(messageId: string, schema: T): Promise<DiscordInteraction.Object<zod.infer<T>> | undefined> => {
    const interaction = await this.query.findByMessageId(messageId);

    if (!interaction) {
      return;
    }

    return {
      ...interaction,
      data: await schema.parseAsync(interaction.data),
    };
  }

  getByMessageId = async <T extends zod.Schema>(messageId: string, schema: T): Promise<DiscordInteraction.Object<zod.infer<T>>> => {
    const interaction = await this.findByMessageId(messageId, schema);

    if (!interaction) {
      throw new Error('Interaction not found');
    }

    return interaction;
  }
}
