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
    if (typeof window.WebTransport !== 'undefined') {
      return new window.WebTransport(url);
    }
    this.closed = new Promise((resolve, reject) => {});
    this.ready = new Promise((resolve, reject) => {});

    this.#wss = new WebSocket(url)
    this.#wss.onopen = () => {
      if(this.#wss.readyState === this.#wss.OPEN) {
        this.ready = Promise.resolve();
      } else if(this.#wss.readyState === this.#wss.CLOSED) {
        this.ready = Promise.reject();
      }
    }
    this.#wss.onclose = () => {
      this.closed = Promise.resolve();
    }
    this.datagrams = new DataGrams(this.#wss);
  }
}


export default WebTransport;
