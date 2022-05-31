import { useContext, useState } from 'react';
import { PresenceContext } from '../components/Context';
import { _presence, _id } from '../components/Provider';
import { PresenceHook } from '../types';

/**
 * A hook to access the value of the `PresenceContext`. This is a low-level
 * hook that you should usually not need to call directly.
 *
 * @returns {any} the value of the `PresenceContext`
 *
 * @example
 *
 * import React from 'react'
 * import { usePresenceContext } from '@precence/react'
 *
 * export const MyComponent = () => {
 *   const { room1 } = usePresenceContext()
 *   return <div>{room1.length}</div>
 * }
 */
export function usePresenceContext(roomName: string): PresenceHook {
  const contextValue = useContext(PresenceContext);
  const [self, setSelf] = useState({ id: _id });
  const [peers, setPeers] = useState<any>([]);
  // if(typeof window === 'undefined') return null
  _presence.toRoom(roomName);
  _presence.on('SYNC', (state: any) => {
    if (state.id === _id) return;

    const peerIdx = peers.findIndex(
      ({ id }: { id: string }) => id === state.id
    );

    if (peerIdx > -1) {
      peers[peerIdx] = state;
      setPeers([...peers]);
      return;
    }
    peers.push(state);
    setPeers([...peers]);
  });
  contextValue[roomName] = {
    self,
    peers,
    setState: (state: any) => {
      const newState = { ...self, ...state };
      setSelf(newState);
      _presence.send('SYNC', newState);
    },
    offline: () => {
      // presence.send('OFF_LINE')
    },
  };

  if (!contextValue) {
    throw new Error(
      'could not find presence context value; please ensure the component is wrapped in a <Provider>'
    );
  }

  return contextValue[roomName];
}
