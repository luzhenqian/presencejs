import { Iterator } from './iterator';

export class DataGrams {
  writable: WritableStream<any>;
  readable: ReadableStream<any>;
  // #iterator: Iterator<Uint8Array>;
  constructor(wss: WebSocket) {
    this.writable = new WritableStream<Uint8Array>({
      write(chunk) {
        return new Promise((resolve, reject) => {
          try {
            wss.send(chunk);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      },
    });

    this.readable = new ReadableStream({
      start(controller) {
        wss.addEventListener('message', ev => {
          controller.enqueue(ev.data);
        });
      },
    });
  }
}
