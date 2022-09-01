import { DataPacket, IRoom, IYomo, MetaData } from './type';

export class Yomo implements IYomo {
  #metaData: MetaData;
  #rooms: Map<string, Room> = new Map();
  constructor() {
    this.#metaData = {
      id: Math.random().toString(36).substring(2, 8),
    };
  }
  entry(roomId: string) {
    const room = new Room(roomId, this.#metaData);
    this.#rooms.set(roomId, room);
    return room;
  }
  leave(roomId: string) {
    const room = this.#rooms.get(roomId);
    if (room) {
      room.leave();
    }
  }
}

class Room implements IRoom {
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
  #send(eventName: string, DataPacket: DataPacket) {
    
  }
}

export const createYomo = () => {
  return new Yomo();
};
