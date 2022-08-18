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
}

if (typeof window !== 'undefined') {
  if (typeof window.WebTransport === "undefined") {
    window.WebTransport = WebTransport;
  }
}

export default WebTransport;
