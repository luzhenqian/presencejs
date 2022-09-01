export class SendStream {
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
        }
        return undefined;
      },
    });
  }
}
