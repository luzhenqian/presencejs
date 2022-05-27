import React, { useMemo, useState } from 'react';
import { PresenceContext } from './Context';
import Presence from '@yomo/presence';
import type { Auth } from '@yomo/presence/dist/type';
import { nanoid } from 'nanoid'

export let presence: Presence;
export let _id: string;

export type PresenceProviderProps<R = any> = {
  presence?: Presence;
  host: string;
  id?: string;
  auth?: Auth;
  children: React.ReactNode;
  context?: React.Context<R>;
};

function Provider({
  presence,
  host,
  id,
  auth,
  children,
  context,
}: PresenceProviderProps) {
  _id = _id || id || nanoid()
  const [self, setSelf] = useState({ id: _id });
  const [peers, setPeers] = useState([]);

  presence = new Presence(host, { auth });
  presence.on('connection', ()=>{
    // TODO: some actions
  })

  const contextValue = useMemo(() => {
    return {
      self,
      peers,
      setState: (state: any) => {
        setSelf({ ...self, ...state });
        // TODO: need get roomID
        // presence.toRoom('roomID')
        // presence.send('SYNC')
      },
      offline: () => {
        // presence.send('OFF_LINE')
      },
    };
  }, [self, peers]);

  const Context = context || PresenceContext;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default Provider;
