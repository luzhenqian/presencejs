import React, { useMemo, useState } from 'react';
import { PresenceContext } from './Context';
import Presence from '@yomo/presence';
import { Auth } from '@yomo/presence/dist/type';

export let presence: Presence;

export type PresenceProviderProps = {
  presence?: Presence;
  host: string;
  id?: string;
  auth?: Auth;
  children: React.ReactNode;
  context?: React.Context<any>;
};

function Provider({ presence, host, id, auth, children, context }: PresenceProviderProps) {
  const [self, setSelf] = useState({ id: 1 });
  const [peers, setPeers] = useState([]);

  presence = new Presence(host, { auth });

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
