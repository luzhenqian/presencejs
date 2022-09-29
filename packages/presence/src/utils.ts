export function randomId() {
  return Math.random()
    .toString(36)
    .substring(2, 36);
}

export function concatenate(...arrays: Uint8Array[]): Uint8Array {
  let totalLen = 0;

  for (let arr of arrays) totalLen += arr.byteLength;

  let res = new Uint8Array(totalLen);

  let offset = 0;

  for (let arr of arrays) {
    let uint8Arr = new Uint8Array(arr);

    res.set(uint8Arr, offset);

    offset += arr.byteLength;
  }

  return res;
}
