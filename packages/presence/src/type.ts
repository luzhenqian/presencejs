declare global {
  interface Window {
    WebTransport: any;
  }
}

export type MetaData = {
  id: string;
};

export type PayloadPacket<T> = {
  metadata: MetaData;
  payload?: T;
};

export type PresenceOptions = { url?: string; id?: string } & {
  publicKey?: string;
};

export type InternalPresenceOptions =
  | { url: string; id: string } & {
      publicKey?: string;
    };

export type IPresence = {
  open: (channelId: string) => IChannel;
  close: (channelId: string) => void;
};

export type PeersSubscribeCallbackFn = (metadata: MetaData) => any;
export type PeersUnsubscribe = Function;
export type PeersSubscribe = (
  callbackFn: PeersSubscribeCallbackFn
) => PeersUnsubscribe;
export type Peers = { subscribe: PeersSubscribe };

export type ChannelEventSubscribeCallbackFn<T> = (
  payload: T,
  metadata: MetaData
) => any;

export type IChannel = {
  id: string;
  broadcast<T>(eventName: string, payload: T): void;
  subscribe<T>(
    eventName: string,
    callbackFn: ChannelEventSubscribeCallbackFn<T>
  ): void;
  getPeers(): Peers;
  close(): void;
};
