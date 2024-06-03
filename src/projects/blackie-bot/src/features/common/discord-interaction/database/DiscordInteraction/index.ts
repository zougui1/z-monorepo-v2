import { DiscordInteraction as DiscordInteractionModel } from './DiscordInteraction';
import { DiscordInteractionQuery } from './DiscordInteractionQuery';

export namespace DiscordInteraction {
  export const Prod = new DiscordInteractionQuery(DiscordInteractionModel.Prod);
  export const Dev = new DiscordInteractionQuery(DiscordInteractionModel.Test);

  export type Query = DiscordInteractionQuery;
  export type Object<T = unknown> = DiscordInteractionModel.Object<T>;
}
