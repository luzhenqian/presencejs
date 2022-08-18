export class DataGrams {
  writable: WritableStream<Uint8Array>;
  readable: ReadableStream<Uint8Array>;
  constructor(wss: WebSocket) {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop === 'writable') {
          return new WritableStream<Uint8Array>({
            start(controller) {
              console.log('start');
            },
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
            close() {
              console.log('close');

              return new Promise((resolve, reject) => {
                resolve();
              });
            },
            abort(reason) {},
          });
        } else if (prop === 'readable') {
          return new ReadableStream({
            start(controller) {
              wss.addEventListener('message', ev => {
                controller.enqueue(ev.data);
              });
            },
          });
        }
        return undefined;
      },
    });
  }
}
