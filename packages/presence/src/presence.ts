import { Channel } from './channel';
import {
  CreatePresence,
  IChannel,
  InternalPresenceOptions,
  IPresence,
  Metadata,
  PresenceOptions,
} from './type';
import { randomId } from './utils';

export class Presence implements IPresence {
  #url: string;
  #metadata: Metadata;
  #channels: Map<string, IChannel> = new Map();
  #transport: any;
  #options: InternalPresenceOptions;
  #onReadyCallbackFn: Function = () => {};
  #onErrorCallbackFn: Function = () => {};
  #onClosedCallbackFn: Function = () => {};

  constructor(options: InternalPresenceOptions) {
    this.#metadata = {
      id: options.id,
    };
    this.#options = options;
    this.#url = this.#formatUrl();
    this.#connect();
  }

  #formatUrl() {
    return `${this.#options.url}?publickey=${this.#options.publicKey}&id=${
      this.#metadata.id
    }`;
  }

  onReady(callbackFn: Function) {
    this.#onReadyCallbackFn = callbackFn;
  }
  onError(callbackFn: Function) {
    this.#onErrorCallbackFn = callbackFn;
  }
  onClosed(callbackFn: Function) {
    this.#onClosedCallbackFn = callbackFn;
  }

  joinChannel(channelId: string, metadata: Metadata) {
    this.#metadata = {
      ...this.#metadata,
      ...metadata,
    };
    const channel = new Channel(channelId, this.#metadata, this.#transport);
    this.#channels.set(channelId, channel);
    return channel;
  }

  leaveChannel(channelId: string) {
    const channel = this.#channels.get(channelId);
    if (channel) {
      channel.leave();
    }
  }

  #connect() {
    this.#transport = new window.WebTransport(this.#url);

    this.#transport.ready
      .then(() => {
        this.#onReadyCallbackFn();
      })
      .catch((e: Error) => {
        this.#onErrorCallbackFn(e);
      });

    this.#transport.closed.then(() => {
      this.#onClosedCallbackFn();
      this.#channels.forEach((channel) => {
        channel.leave();
      });
    });
  }
}

export const createPresence: CreatePresence = async (
  options: PresenceOptions
) => {
  return new Promise((resolve) => {
    let id = options?.id || randomId();
    let url = options?.url || 'https://prsc.yomo.dev';
    const internalOptions: InternalPresenceOptions = { ...options, id, url };
    const presence = new Presence(internalOptions);
    presence.onReady(() => {
      resolve(presence);
    });
    // presence.onClosed(() => {
    //   reject('closed');
    // });
    // presence.onError((e: any) => {
    //   reject(e);
    // });
  });
};
