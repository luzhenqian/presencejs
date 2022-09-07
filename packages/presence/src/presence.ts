import { Channel } from './channel';
import {
  IChannel,
  InternalPresenceOptions,
  IPresence,
  MetaData,
  PresenceOptions,
} from './type';
import { randomId } from './utils';

export class Presence implements IPresence {
  #metaData: MetaData;
  #channels: Map<string, IChannel> = new Map();
  constructor(options: InternalPresenceOptions) {
    this.#metaData = {
      id: options.id,
    };
  }
  open(channelId: string) {
    const channel = new Channel(channelId, this.#metaData);
    this.#channels.set(channelId, channel);
    return channel;
  }
  close(channelId: string) {
    const channel = this.#channels.get(channelId);
    if (channel) {
      channel.leave();
    }
  }
}

export const createPresence = (options: PresenceOptions) => {
  let id = options?.id || randomId();
  const internalOptions: InternalPresenceOptions = { ...options, id };
  return new Presence(internalOptions);
};
