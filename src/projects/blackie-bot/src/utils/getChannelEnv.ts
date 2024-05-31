import { EnvType } from '../EnvType';
import { config } from '../config';

export const getChannelEnv = (channelId: string): EnvType => {
  return config.development.discord.channelIds.includes(channelId)
    ? EnvType.Test
    : EnvType.Production;
}
