import { CommandResponse } from '../command/CommandResponse';
import { ReplyableInteraction } from '../types';

export interface ComponentBuilder {
  setCustomId(id: string): this;
}

export interface ComponentActionContext<
  Interaction extends ReplyableInteraction,
> {
  interaction: Interaction;
  response: CommandResponse;
}

export interface CreatedComponent<Builder extends ComponentBuilder> {
  builder: Builder;
}

export type ComponentAction<Interaction extends ReplyableInteraction> = (context: ComponentActionContext<Interaction>) => void | Promise<void>;

export interface ComponentCreatorContext<
  Options extends Record<string, any> = {},
  Builder extends ComponentBuilder = ComponentBuilder
> {
  options: Options;
  builder: Builder;
}

export type ComponentCreator<
  Options extends Record<string, any> = {},
  Builder extends ComponentBuilder = ComponentBuilder
> = (context: ComponentCreatorContext<Options, Builder>) => Builder;
