// import "regenerator-runtime/runtime.js";
import { BidirectionalStream } from "./BidirectionalStream";
import { DataGrams } from "./DataGrams";
import { ReceiveStream } from "./ReceiveStream";
import { SendStream } from "./SendStream";

declare global {
  interface Window {
    WebTransport: any;
  }
}

export class WebTransport {
  public closed: Promise<unknown>;
  public ready: Promise<unknown>;
  #ws: WebSocket;
  #connErr: any;
  datagrams: DataGrams;
  constructor(public url: string) {
    this.closed = new Promise((resolve, reject) => { });
    this.ready = new Promise((resolve, reject) => {
      url = url.replace(/^http/, 'ws');
      this.#ws = new WebSocket(url);
      this.#ws.addEventListener('open', () => {
        resolve(null);
      }),
      this.#ws.addEventListener('error', (err) => {
        this.#connErr = err;
        reject(err);
      }),
      this.#ws.addEventListener('close', () => {
        this.closed = new Promise((resolve, reject) => { });
        reject(this.#connErr);
      }),
      this.datagrams = new DataGrams(this.#ws);
    });
  }
  createSendStream(): SendStream {
    return new SendStream(this.#ws);
  }
  receiveStream(): ReceiveStream{
    return new ReceiveStream(this.#ws);
  }
  createBidirectionalStream(): Promise<BidirectionalStream> {
    return new Promise((resolve, reject) => {
      resolve(new BidirectionalStream(this.#ws));
    })
  }
  receiveBidrectionalStreams(): BidirectionalStream {
    return new BidirectionalStream(this.#ws);
  }
}

if (typeof window !== 'undefined') {
  if (typeof window.WebTransport === "undefined") {
    window.WebTransport = WebTransport;
  }
}

export default WebTransport;
