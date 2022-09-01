export type MetaData = {
  id: string;
};

export type DataPacket = {
  metadata: MetaData;
  payload: any;
};

export type IYomo = {
  entry: (roomId: string) => IRoom;
  leave: (roomId: string) => void;
};

type Others = MetaData[];

export type IRoom = {
  id: string;
  send<T>(eventName: string, payload: T): void;
  on<T>(
    eventName: string,
    callbackFn: (payload: T, metadata: MetaData) => any
  ): void;
  getOthers(): Others;
  leave(): void;
};
