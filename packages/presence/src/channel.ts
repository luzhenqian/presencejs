import {
  ChannelEventSubscribeCallbackFn,
  PayloadPacket,
  IChannel,
  MetaData,
  Peers,
  PeersSubscribeCallbackFn,
} from './type';

export class Channel implements IChannel {
  #transport: any;
  #metaData: MetaData;
  #subscribers = new Map<string, ChannelEventSubscribeCallbackFn<any>>();
  id: string;
  constructor(id: string, metadata: MetaData, transport: any) {
    this.id = id;
    this.#metaData = metadata;
    this.#transport = transport;
    this.#broadcast('TOROOM', { metadata: { id } });
    this.#broadcast('OPEN', { metadata: { id } });
    this.#read();
  }
  broadcast<T>(eventName: string, payload: T): void {
    this.#broadcast(eventName, this.#getDataPacket(payload));
  }
  async subscribe<T>(
    eventName: string,
    callbackFn: ChannelEventSubscribeCallbackFn<T>
  ): Promise<void> {
    this.#subscribers.set(eventName, callbackFn);
  }
  getPeers(): Peers {
    return new Others(this.#transport);
  }
  close() {}
  #getDataPacket<T>(payload: T) {
    return {
      metadata: this.#metaData,
      payload,
    };
  }
  #broadcast(eventName: string, dataPacket: PayloadPacket) {
    const writer = this.#transport.datagrams.writable.getWriter();
    writer.write(
      encoder({
        event: eventName,
        data: {
          id: dataPacket.metadata.id,
          ...(dataPacket.payload || {}),
        },
      })
    );
    writer.close();
  }
  async #read() {
    try {
      const reader = this.#transport.datagrams.readable.getReader();
      let result = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        console.log(decoder(value));
        result += decoder(value);
      }
      return result;
    } catch (e) {
      return;
    }
  }
}

class Others extends Promise<MetaData[]> implements Peers {
  #transport: any = null;
  constructor(transport: any) {
    super((resolve, reject) => {
      // TODO:
      if (true) return resolve([]);
      else return reject();
    });
    this.#transport = transport;
    // TODO: broadcast
  }
  subscribe(callbackFn: PeersSubscribeCallbackFn) {
    return () => {
      callbackFn;
    };
  }
}

function encoder(data: any) {
  return (window as any).encode(0x11, data).buffer;
}

function decoder(data: any) {
  const uint8buf = new Uint8Array(data);
  return (window as any).decode(0x11, uint8buf);
}
