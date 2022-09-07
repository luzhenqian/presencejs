import {
  DataPacket,
  IChannel,
  MetaData,
  OthersPromise,
  OtherSubscribeCallbackFn,
} from './type';

export class Channel implements IChannel {
  #metaData: MetaData;
  id: string;
  constructor(id: string, metadata: MetaData) {
    this.id = id;
    this.#metaData = metadata;
  }
  broadcast<T>(eventName: string, payload: T): void {
    this.#broadcast(eventName, this.#getDataPacket(payload));
  }
  subscribe<T>(
    eventName: string,
    callbackFn: (payload: T, metadata: { id: string }) => any
  ): void {
    throw new Error('Method not implemented.');
  }
  getOthers(): OthersPromise {
    return new Others();
  }
  leave() {}
  #getDataPacket<T>(payload: T) {
    return {
      metadata: this.#metaData,
      payload,
    };
  }
  #broadcast(eventName: string, DataPacket: DataPacket) {}
}

class Others extends Promise<MetaData[]> implements OthersPromise {
  constructor() {
    super((resolve, reject) => {
      // TODO: 
    });
  }
  subscribe(callbackFn: OtherSubscribeCallbackFn) {
    return () => {};
  }
}
