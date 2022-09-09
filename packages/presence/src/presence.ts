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
  #connectedResolve: Function | null = null;
  #connectedReject: Function | null = null;
  #channels: Map<string, IChannel> = new Map();
  #transport: any;
  #options: InternalPresenceOptions;
  constructor(options: InternalPresenceOptions) {
    this.#metaData = {
      id: options.id,
    };
    this.#options = options;
    this.#url = this.#formatUrl();
    this.#loadWasm().then(() => this.#connect());
  }

  #formatUrl() {
    return `${this.#options.url}?public_key=${this.#options.publicKey}`;
  }

  async connected() {
    return new Promise((resolve, reject) => {
      this.#connectedResolve = resolve;
      this.#connectedReject = reject;
    });
  }

  open(channelId: string) {
    const channel = new Channel(channelId, this.#metaData, this.#transport);
    this.#channels.set(channelId, channel);
    return channel;
  }

  close(channelId: string) {
    const channel = this.#channels.get(channelId);
    if (channel) {
      channel.close();
    }
  }

  #connect() {
    this.#transport = new window.WebTransport(this.#url);

    this.#transport.ready
      .then(() => {
        this.#connectedResolve && this.#connectedResolve(null);
      })
      .catch((e: Error) => {
        this.#connectedReject && this.#connectedReject(e);
      });

    this.#transport.closed.then(() => {
      this.#channels.forEach((channel) => {
        channel.close();
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
