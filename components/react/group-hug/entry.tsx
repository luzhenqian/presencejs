import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPresence } from '@yomo/presence';
import '@yomo/webtransport-polyfill';
import GroupHug from './index';

const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);

const id = Math.random().toString();
const avatar = `https://robohash.org/${id}`;
const presence = createPresence({
  url: 'https://prscd2.allegro.earth/v1',
  publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
  id,
  appId: 'lzq',
});

root.render(<GroupHug presence={presence} id={id} avatar={avatar} />);
