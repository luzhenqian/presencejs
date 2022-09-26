import {
  ChannelEventSubscribeCallbackFn,
  PayloadPacket,
  IChannel,
  MetaData,
  IPeers,
  PeersSubscribeCallbackFn,
} from './type';
import { encode, decode } from "@msgpack/msgpack";

export class Channel implements IChannel {
  #transport: any;
  #metaData: MetaData;
  #subscribers = new Map<string, ChannelEventSubscribeCallbackFn<any>>();
  #members: MetaData[] = [];
  #peers: Peers | null = null;
  #joinTimestamp: number;
  id: string;
  constructor(id: string, metadata: MetaData, transport: any) {
    this.id = id;
    this.#metaData = metadata;
    this.#transport = transport;
    this.#joinTimestamp = Date.now()
    console.log(this.#joinTimestamp);

    this.#broadcast('TOROOM', { metadata: { id } });
    this.#subscribeSignaling();
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
    if (!this.#peers) {
      this.#peers = new Peers(this.#transport);
    }
    return this.#peers.subscribe(callbackFn);
  }
  leave() {
    const writer = this.#transport.datagrams.writable.getWriter();
    writer.write(
      encode({ event: 'LEAVE_CHANNEL', metadata: { id: this.id } })
    );
    writer.close();
  }
  #getDataPacket<T>(payload: T) {
    return {
      metadata: this.#metaData,
      payload,
    };
  }
  #broadcast<T>(eventName: string, dataPacket: PayloadPacket<T>) {
    const writer = this.#transport.datagrams.writable.getWriter();
    writer.write(
      encode({
        event: eventName,
        metadata: dataPacket.metadata,
        payload: dataPacket.payload || null,
      })
    );
    writer.close();
  }
  async #read() {
    try {
      const reader = this.#transport.datagrams.readable.getReader();
      let result: any = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        console.log(decode(value));
        result += decode(value);
      }
      return result;
    } catch (e) {
      return;
    }
  }
  #joinHandler() {
    // subscribe JOIN_CHANNEL event, add members
    this.subscribe('TOROOM', (_, metadata: MetaData) => {
      if (metadata.id === this.#metaData.id) return;
      const member = this.#members.find((member) => member.id === metadata.id);
      if (!member) {
        // add members
        this.#members.push(this.#metaData);
        this.#peers?.trigger(this.#members);
      }
    });
  }
  #leaveHandler() {
    // subscribe LEAVE_CHANNEL event, remove members
    this.subscribe('LEAVE_CHANNEL', (_, metadata: MetaData) => {
      if (metadata.id === this.#metaData.id) return;
      const memberIndex = this.#members.findIndex(
        (member) => member.id === metadata.id
      );
      if (memberIndex > -1) {
        // remove members
        this.#members.splice(memberIndex, 1);
      }
      this.#peers?.trigger(this.#members);
    });
  }
  #subscribeSignaling() {
    this.#joinHandler();
    this.#leaveHandler();
  }
}

class Peers implements IPeers {
  #transport: any = null;
  #callbackFns: PeersSubscribeCallbackFn[] = [];
  constructor(transport: any) {
    this.#transport = transport;
    console.log(this.#transport);
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
  trigger(members: MetaData[]) {
    this.#callbackFns.forEach((callbackFn) => {
      callbackFn(members);
    });
  }
}
