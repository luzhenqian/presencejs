export class Iterator<T> {
  #data: T[];
  constructor() {
    this.#data = []
  }

  push(value: T) {
    this.#data.push(value);
  }

  next(): { done: boolean, value: T | undefined } {
    if (this.#data.length === 0) { return { done: true, value: undefined } }
    const value = this.#data.shift();
    return { value, done: true };
  }
}
