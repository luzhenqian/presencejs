import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPresence } from '@yomo/presence';
import { faker } from '@faker-js/faker';
import GroupHug from './index';

const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);

const id = Math.random().toString();
const avatar = Math.random() > 0.5 ? `https://robohash.org/${id}` : void 0;
const randomName = faker.name.fullName();
const presence = createPresence({
  url: 'https://prscd2.allegro.earth/v1',
  publicKey: 'BYePWMVCfkWRarcDLBIbSFzrMkDldWIBuKsA',
  id,
  appId: 'lzq',
});

root.render(
  <div style={{ margin: '40px' }}>
    <GroupHug presence={presence} id={id} avatar={avatar} name={randomName} />
  </div>
);
