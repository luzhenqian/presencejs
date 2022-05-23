import React, { useMemo, useState } from "react";
import { PresenceContext } from "./Context";

// TODO: add type
export let presence: any;

// TODO: add type
function Provider({ presence, host, id, auth, children, context }:any) {
  const [self, setSelf] = useState({ id: 1 });
  const [peers, setPeers] = useState([]);

  // presence = new Presence()

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
      }
    };
  }, [self, peers]);

  const Context = context || PresenceContext;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default Provider;
