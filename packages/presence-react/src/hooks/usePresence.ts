import { useContext } from "react";
import { PresenceContext } from "../components/Context";
import { presence } from "../components/Provider";
import { usePresenceContext as useDefaultPresenceContext } from "./usePresenceContext";

export function createPresenceHook(context = PresenceContext) {
  const usePresenceContext =
    context === PresenceContext
      ? useDefaultPresenceContext
      : () => useContext(context);

  const toRoom = (roomID: string) => {
    // presence.toRoom(roomID)
  };

  return function (roomID: string, initialState: any) {
    toRoom(roomID);
    // TODO: set initialState
    return usePresenceContext();
  };
}

export const usePresence = createPresenceHook();
