export class DataGrams {
  writable: WritableStream<Uint8Array>;
  readable: ReadableStream<Uint8Array>;
  constructor(ws: WebSocket) {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop === 'writable') {
          return new WritableStream<Uint8Array>({
            start(controller) {},
            write(chunk) {
              return new Promise((resolve, reject) => {
                try {
                  ws.send(chunk);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              });
            },
            close() {},
            abort(reason) {},
          });
        } else if (prop === 'readable') {
          return new ReadableStream({
            start(controller) {
              const cb = ev => {
                controller.enqueue(ev.data);
                ws.removeEventListener('message', cb);
              };
              ws.addEventListener('message', cb);
            },
            cancel() {},
          });
        }
        return undefined;
      },
    });
  }
}
