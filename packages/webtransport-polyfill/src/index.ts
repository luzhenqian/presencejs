// import "regenerator-runtime/runtime.js";
import { DataGrams } from "./datagrams";

declare global {
  interface Window {
    WebTransport: any;
  }
}

export class WebTransport {
  public closed: Promise<unknown>;
  public ready: Promise<unknown>;
  #wss: WebSocket;
  #connErr: any;
  datagrams: DataGrams;
  constructor(public url: string) {
    this.closed = new Promise((resolve, reject) => { });
    this.ready = new Promise((resolve, reject) => { 
      this.#wss = new WebSocket(url);
      this.#wss.addEventListener('open', () => {
        resolve(null);
      }),
      this.#wss.addEventListener('error', (err) => {
        this.#connErr = err;
        reject(err);
      }),
      this.#wss.addEventListener('close', () => {
        this.closed = new Promise((resolve, reject) => { });
        reject(this.#connErr);
      }),
      this.datagrams = new DataGrams(this.#wss);
    });
  }
}

if (typeof window !== 'undefined') {
  if (typeof window.WebTransport === "undefined") {
    window.WebTransport = WebTransport;
  }
}

export default WebTransport;
