import {
  ChannelEventSubscribeCallbackFn,
  PayloadPacket,
  IChannel,
  MetaData,
  IPeers,
  PeersSubscribeCallbackFn,
} from './type';

export class Channel implements IChannel {
  #transport: any;
  #metaData: MetaData;
  #subscribers = new Map<string, ChannelEventSubscribeCallbackFn<any>>();
  #members: MetaData[] = [];
  id: string;
  constructor(id: string, metadata: MetaData, transport: any) {
    this.id = id;
    this.#metaData = metadata;
    this.#transport = transport;
    this.#broadcast('TOROOM', { metadata: { id } });
    this.#broadcast('__OPEN__', { metadata: { id } });
    this.#openHandler();
    this.#closeHandler();
    this.#read();
  }
  broadcast<T>(eventName: string, payload: T): void {
    this.#broadcast(eventName, this.#getDataPacket<T>(payload));
  }
  async subscribe<T>(
    eventName: string,
    callbackFn: ChannelEventSubscribeCallbackFn<T>
  ): Promise<void> {
    this.#subscribers.set(eventName, callbackFn);
  }
  subscribePeers(callbackFn: PeersSubscribeCallbackFn) {
    const peers = new Peers(this.#transport, this.#members);
    return peers.subscribe(callbackFn);
  }
  leave() {}
  #getDataPacket<T>(payload: T) {
    return {
      metadata: this.#metaData,
      payload,
    };
  }
  #broadcast<T>(eventName: string, dataPacket: PayloadPacket<T>) {
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
  #openHandler() {
    // subscribe __OPEN__ event, add members
    this.subscribe('__OPEN__', (metadata: MetaData) => {
      if (metadata.id === this.#metaData.id) return;
      const member = this.#members.find((member) => member.id === metadata.id);
      if (!member) {
        // add members
        this.#members.push(this.#metaData);
      }
    });
  }
  #closeHandler() {
    // subscribe __CLOSE__ event, remove members
    this.subscribe('__CLOSE__', (metadata: MetaData) => {
      if (metadata.id === this.#metaData.id) return;
      const memberIndex = this.#members.findIndex(
        (member) => member.id === metadata.id
      );
      if (memberIndex > -1) {
        // remove members
        this.#members.splice(memberIndex, 1);
      }
    });
  }
}

class Peers implements IPeers {
  #transport: any = null;
  #members: MetaData[] = [];
  #callbackFns: PeersSubscribeCallbackFn[] = [];
  constructor(transport: any, members: MetaData[]) {
    this.#transport = transport;
    this.#members = members;
    // TODO: broadcast
  }
  subscribe(callbackFn: PeersSubscribeCallbackFn) {
    this.#callbackFns.push(callbackFn);
    return () => {
      const fnIndex = this.#callbackFns.findIndex((fn) => fn === callbackFn);
      if (fnIndex > -1) {
        this.#callbackFns.splice(fnIndex, 1);
      }
    };
  }
  trigger() {
    this.#callbackFns.forEach((callbackFn) => {
      callbackFn(this.#members);
    });
  }
}

function encoder(data: any) {
  return (window as any).encode(0x11, data).buffer;
}

function decoder(data: any) {
  const uint8buf = new Uint8Array(data);
  return (window as any).decode(0x11, uint8buf);
}
