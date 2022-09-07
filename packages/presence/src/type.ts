declare global {
  interface Window {
    WebTransport: any;
  }
}

export type MetaData = {
  id: string;
};

export type DataPacket = {
  metadata: MetaData;
  payload?: any;
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

export type OtherSubscribeCallbackFn = (metadata: MetaData) => any;
export type OtherUnsubscribe = Function;
export type OtherSubscribe = (
  callbackFn: OtherSubscribeCallbackFn
) => OtherUnsubscribe;
export type OthersPromise = Promise<MetaData[]> & { subscribe: OtherSubscribe };

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
  getOthers(): OthersPromise;
  leave(): void;
};
