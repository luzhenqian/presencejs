import fetch from 'node-fetch';
import { createPresence } from '../src/presence';
import { WebTransport } from '../../webtransport-polyfill/src/index';
var streams = require('web-streams-polyfill/ponyfill');

// @ts-ignore
globalThis.fetch = fetch;
// @ts-ignore
globalThis.WebTransport = WebTransport;
// @ts-ignore
globalThis.WritableStream = streams.WritableStream;
// @ts-ignore
globalThis.ReadableStream = streams.ReadableStream;

describe('Presence', () => {
  it('create presence', async () => {
    const presence = createPresence({
      url: 'wss://prsc.yomo.dev',
      publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
    });
    await presence.connected();
    expect(presence).toBeDefined();
  });

  it('open channel', async () => {
    const presence = createPresence({
      url: 'wss://prsc.yomo.dev',
      publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
    });

    await presence.connected();
    const groupHugChannel = presence.open('group-hug');
    expect(groupHugChannel).toBeDefined();
  });

  it('get others', async () => {
    const p1 = createPresence({
      url: 'wss://prsc.yomo.dev',
      id: '1',
      publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
    });
    const p2 = createPresence({
      url: 'wss://prsc.yomo.dev',
      id: '2',
      publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
    });

    await p1.connected();
    p1.open('group-hug');

    await p2.connected();
    const groupHugChannel = p2.open('group-hug');
    const others = await groupHugChannel.getOthers();
    // expect(others).toEqual([{ id: '1' }]);
    throw Error('123');
  });
});
