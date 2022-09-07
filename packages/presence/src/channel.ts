import {
  DataPacket,
  IChannel,
  MetaData,
  OthersPromise,
  OtherSubscribeCallbackFn,
} from './type';

export class Channel implements IChannel {
  #transport: any;
  #metaData: MetaData;
  id: string;
  constructor(id: string, metadata: MetaData, transport: any) {
    this.id = id;
    this.#metaData = metadata;
    this.#transport = transport;
    this.#broadcast('TOROOM', { metadata: { id } });
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
  #broadcast(eventName: string, dataPacket: DataPacket) {
    const writer = this.#transport.datagrams.writable.getWriter();
    writer(
      encoder({
        event: eventName,
        data: {
          id: dataPacket.metadata.id,
          ...(dataPacket.payload || {}),
        },
      })
    );
  }
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

function encoder(data: any) {
  return (window as any).encode(0x11, data).buffer;
}

function decoder(data: any) {
  const uint8buf = new Uint8Array(data);
  return (window as any).decode(0x11, uint8buf);
}
