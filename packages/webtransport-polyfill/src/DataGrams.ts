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
              let timer: any | null = null;
              const cb = ev => {
                if (timer) {
                  clearTimeout(timer);
                }
                controller.enqueue(ev.data);
                timer = setTimeout(
                  () => ws.removeEventListener('message', cb),
                  1_000
                );
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
