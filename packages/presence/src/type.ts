declare global {
  interface Window {
    WebTransport: any;
  }
}

export type Metadata = {
  id: string;
  [key: string]: any;
};

export type PayloadPacket<T> = {
  metadata: Metadata;
  payload?: T;
};

export type PresenceOptions = {
  url?: string;
  id?: string;
  publicKey?: string;
  appId?: string;
  appSecret?: string;
  endpoint?: string;
};

export type InternalPresenceOptions = {
  url: string;
  id: string;
  publicKey?: string;
  appId?: string;
  appSecret?: string;
  endpoint?: string;
};

export interface IPresence {
  onReady(callbackFn: (presence: IPresence) => void): void;
  joinChannel: (channelId: string, metadata?: Metadata) => IChannel;
  leaveChannel: (channelId: string) => void;
}

export type PeersSubscribeCallbackFn = (peers: Metadata[]) => any;
export type PeersUnsubscribe = Function;
export type PeersSubscribe = (
  callbackFn: PeersSubscribeCallbackFn
) => PeersUnsubscribe;
export type IPeers = { subscribe: PeersSubscribe };

export type ChannelEventSubscribeCallbackFn<T> = (
  payload: T,
  metadata: Metadata
) => any;

export type IChannel = {
  id: string;
  broadcast<T>(eventName: string, payload: T): void;
  subscribe<T>(
    eventName: string,
    callbackFn: ChannelEventSubscribeCallbackFn<T>
  ): void;
  subscribePeers: PeersSubscribe;
  updateMetadata: (metadata: Metadata) => void;
  leave(): void;
};

export interface Signaling {
  t: 'control' | 'data';
  op?: 'channel_join' | 'peer_online' | 'peer_state' | 'peer_offline';
  p?: string;
  c: string;
  pl?: ArrayBuffer;
}
