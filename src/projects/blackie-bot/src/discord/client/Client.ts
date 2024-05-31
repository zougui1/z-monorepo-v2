import { REST, Client as DiscordClient, type ClientOptions as DiscordClientOptions } from 'discord.js';
import createDebug from 'debug';
import { retry } from 'radash';

import { ClientState } from './ClientState';
import { initializeCommands, logCreatedCommands } from './utils';
import { InteractionHandler, InteractionHandlerSet } from '../InteractionHandlerSet';
import { onceProgramExit } from '../utils';
import type { ICommand } from '../command';
import type { Middleware } from '../types';
import chalk from 'chalk';

const debug = createDebug('@zougui:discord');

// 10 seconds
const INITIALIZATION_RETRY_DELAY = 10 * 1000;

export class Client {
  readonly client: DiscordClient;
  readonly #state: ClientState;
  readonly #rest: REST;
  readonly #token: string;
  readonly #clientId: string;
  readonly #commands: Map<string, ICommand> = new Map();
  readonly #middlewares: Middleware[] = [];
  readonly #interactionHandlerSet: InteractionHandlerSet = new InteractionHandlerSet();

  constructor({ token, clientId, ...options }: ClientOptions) {
    this.client = new DiscordClient(options);
    this.#rest = new REST();
    this.#state = new ClientState(this.client);
    this.#token = token;
    this.#clientId = clientId;

    this._init();
  }

  addCommand(command: ICommand & InteractionHandler): this {
    this.#commands.set(command.name, command);
    this.#interactionHandlerSet.add(command, ...command.subInteractionHandlers);
    return this;
  }

  use(...middlewares: Middleware[]): this {
    this.#middlewares.push(...middlewares);
    return this;
  }

  async start(): Promise<void> {
    this.client.login(this.#token);
    let tried = 0;

    await retry({ times: 3, delay: INITIALIZATION_RETRY_DELAY }, async () => {
      if (tried++ > 0) {
        console.log(`Retrying command initialization (attempt: ${tried})`);
      }

      await this._initializeCommands();
    });
  }

  destroy = async (): Promise<void> => {
    debug('destroy discord bot');
    await this.client.destroy();
  }

  //#region private methods
  private async _initializeCommands(): Promise<void> {
    const commands = Array.from(this.#commands.values()).map(command => command.toObject());
    const result = await initializeCommands(this.#rest, this.#clientId, commands);

    //await require('fs').writeFileSync('/mnt/Dev/Code/javascript/zougui/src/packages/common/discord/commands.json', JSON.stringify(commands, null, 2));

    if (result.success) {
      logCreatedCommands(commands);
      // TODO
      /*this.client.on('interactionCreate', createInteractionHandler({
        commands: this.#commands,
        //selectMenus: this.selectMenus,
        //buttons: this.buttons,qz
        //modals: this.modals,
      }));*/
      this.client.on('interactionCreate', async interaction => {
        try {
          await this.#interactionHandlerSet.handle(interaction);
        } catch (error) {
          debug(chalk.redBright('[ERROR]'), error);
        }
      });
      await this.#state.setInitializedPresence();
    } else {
      console.error('Failed to initialize commands');
      await this.#state.setInitializationErrorPresence();
    }
  }

  private _init(): void {
    this.#rest.setToken(this.#token);

    this.client.once('ready', async client => {
      debug(`Logged in as ${client.user.tag}`);
      await this.#state.setReadyPresence();
    });

    onceProgramExit(this.destroy);
  }
  //#endregion
}

export interface ClientOptions extends DiscordClientOptions {
  token: string;
  clientId: string;
}
