export type MetaData = {
  id: string;
};

export type DataPacket = {
  metadata: MetaData;
  payload: any;
};

export type PresenceOptions = { id?: string } & {
  publicKey?: string;
};

export type InternalPresenceOptions =
  | { id: string } & {
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

export type IChannel = {
  id: string;
  broadcast<T>(eventName: string, payload: T): void;
  subscribe<T>(
    eventName: string,
    callbackFn: (payload: T, metadata: MetaData) => any
  ): void;
  getOthers(): OthersPromise;
  leave(): void;
};
