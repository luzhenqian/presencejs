import { Channel } from './channel';
import {
  IChannel,
  InternalPresenceOptions,
  IPresence,
  MetaData,
  PresenceOptions,
} from './type';
import { randomId } from './utils';
import { loadWasm } from './wasm-loader';

export class Presence implements IPresence {
  #url: string;
  #metaData: MetaData;
  #channels: Map<string, IChannel> = new Map();
  constructor(options: InternalPresenceOptions) {
    this.#metaData = {
      id: options.id,
    };
    this.#url = options.url;
    this.#loadWasm().then(this.#connect);
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

  async #connect() {
    const transport = new window.WebTransport(this.#url);

    try {
      await transport.ready;
    } catch (e) {}

    transport.closed.then(() => {
      this.#channels.forEach((channel) => {
        channel.leave();
      });
    });
  }

  async #loadWasm() {
    await loadWasm();
  }
}

export const createPresence = (options: PresenceOptions) => {
  let id = options?.id || randomId();
  let url = options?.url || 'https://prsc.yomo.dev';
  const internalOptions: InternalPresenceOptions = { ...options, id, url };
  return new Presence(internalOptions);
};
