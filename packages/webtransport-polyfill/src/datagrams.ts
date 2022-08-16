export class DataGrams {
  writable: WritableStream<any>;
  readable: ReadableStream<any>;
  constructor(wss: WebSocket) {
    this.writable = new WritableStream<ArrayBuffer>({
      write(chunk) {
        return new Promise((resolve, reject) => {
          wss.send(chunk);
        });
      },
    });
    this.readable = new ReadableStream({
      start(controller) {},
    });
  }
}
