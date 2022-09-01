import { DataPacket, IRoom, MetaData } from "./type";

export class Room implements IRoom {
  #metaData: MetaData;
  id: string;
  constructor(id: string, metadata: MetaData) {
    this.id = id;
    this.#metaData = metadata;
  }
  send<T>(eventName: string, payload: T): void {
    this.#send(eventName, this.#getDataPacket(payload));
  }
  on<T>(
    eventName: string,
    callbackFn: (payload: T, metadata: { id: string }) => any
  ): void {
    throw new Error('Method not implemented.');
  }
  getOthers(): { id: string }[] {
    throw new Error('Method not implemented.');
  }
  leave() {}
  #getDataPacket<T>(payload: T) {
    return {
      metadata: this.#metaData,
      payload,
    };
  }
  #send(eventName: string, DataPacket: DataPacket) {}
}
