import { EnvType } from '../EnvType';
import { config } from '../config';

export const getChannelEnv = (channelId: string): EnvType => {
  return config.discord.test.channelIds.includes(channelId)
    ? EnvType.Test
    : EnvType.Production;
}
