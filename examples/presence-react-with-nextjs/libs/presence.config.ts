import { createPresence } from '../../../packages/presence/dist/index';
import { createChannelContext } from '../../../packages/presence-react/dist/index';
import { getRandomName } from './getRandomName';

export const id = String(Math.floor(Math.random() * 100_000));
export const name = getRandomName(3);

const presence = createPresence({
  url: `https://lo.allegrocloud.io:8443/v1/ws`,
  publicKey: 'hRkeANwvPFlhQLwPoVAtsNPtxclCATHpYcwz',
  id,
});

export const { ChannelProvider, usePeers, useMyState, useUpdateMyState } =
  createChannelContext(presence);
