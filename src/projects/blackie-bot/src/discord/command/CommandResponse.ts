import type { Message, BaseMessageOptions } from 'discord.js';

import { hasDiscordWebhookTokenExpired } from './utils';
import { Queue } from '../utils';
import type { ReplyableInteraction } from '../types';

export class CommandResponse {
  readonly #interaction: ReplyableInteraction;
  #replied: boolean = false;
  #queue: Queue = new Queue();
  #discordMessage: Message | undefined;
  components: BaseMessageOptions['components'];
  contents: string[] = [];

  constructor(interaction: ReplyableInteraction) {
    this.#interaction = interaction;
  }

  async send(message: string, options?: ReplyOptions): Promise<Message> {
    return await this.#queue.run(async () => {
      const fullMessage = [...this.contents, message].join('\n\n');

      return await this._reply(fullMessage, options);
    });
  }

  addContent(message: string): void {
    this.#queue.run(() => {
      this.contents.push(message);
    });
  }

  addWarning(message: string): void {
    this.addContent(`⚠️ ${message}`);
  }

  async sendSuccess(message: string, options?: ReplyOptions): Promise<Message> {
    return await this.send(`✅\n${message}`, options);
  }

  async sendError(message: string, options?: ReplyOptions): Promise<Message> {
    return await this.send(`❌\n**Error**:\n${message}`, options);
  }

  async defer(options?: DeferOptions): Promise<Message> {
    return await this.#queue.run(async () => {
      this.#replied = true;
      return this.#interaction.deferReply({
        ...options,
        fetchReply: true,
      });
    });
  }

  private async _reply(message: string, options?: ReplyOptions): Promise<Message> {
    try {
      if (this.#replied) {
        return await this.#interaction.editReply({
          content: message,
          components: options?.components,
        });
      }

      this.#replied = true;

      return this.#discordMessage = await this.#interaction.reply({
        ...options,
        content: message,
        fetchReply: true,
      });
    } catch (error) {
      return await this._replyFallback(error, message, options);
    }
  }

  private async _replyFallback(error: unknown, message: string, options?: ReplyOptions): Promise<Message> {
    if (
      !hasDiscordWebhookTokenExpired(error) ||
      !this.#interaction.channel
    ) {
      throw error;
    }

    if (this.#discordMessage) {
      return this.#discordMessage = await this.#discordMessage.edit({
        content: message,
        components: options?.components,
      });
    }

    return this.#discordMessage = await this.#interaction.channel.send({
      content: message,
      components: options?.components,
    });
  }
}

export interface ReplyOptions {
  components?: BaseMessageOptions['components'] | undefined;
  ephemeral?: boolean;
}

export interface DeferOptions {
  ephemeral?: boolean;
}
