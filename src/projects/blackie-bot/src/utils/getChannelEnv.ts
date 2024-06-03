import { EnvType } from '../EnvType';
import { config } from '../config';

export const getChannelEnv = (channelId: string): EnvType => {
  return config.production.discord.channelIds.includes(channelId)
    ? EnvType.Production
    : EnvType.Development;
}
