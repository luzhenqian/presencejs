import Go from './wasm-exec';
const y3WasmPath = 'https://d1lxb757x1h2rw.cloudfront.net/y3.wasm';

/**
 * Load wasm
 */
export async function loadWasm(): Promise<void> {
  // This is a polyfill for FireFox and Safari
  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }

  const go = new Go();

  go.importObject.env['syscall/js.finalizeRef'] = () => {};

  try {
    const result = await WebAssembly.instantiateStreaming(
      fetch(y3WasmPath),
      go.importObject
    );

    go.run(result.instance);
  } catch (error) {
    return Promise.reject(error);
  }
}
