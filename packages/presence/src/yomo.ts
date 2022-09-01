import { Room } from './room';
import { IYomo, MetaData } from './type';
import { randomId } from './utils';

export class Yomo implements IYomo {
  #metaData: MetaData;
  #rooms: Map<string, Room> = new Map();
  constructor() {
    this.#metaData = {
      id: randomId(),
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
