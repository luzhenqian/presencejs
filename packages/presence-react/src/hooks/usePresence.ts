import { useContext } from "react";
import { PresenceContext } from "../components/Context";
import { usePresenceContext as useDefaultPresenceContext } from "./usePresenceContext";

export function createPresenceHook(context = PresenceContext) {
  const usePresenceContext =
    context === PresenceContext
      ? useDefaultPresenceContext
      : () => useContext(context);

      // roomName: string, initialState: any
  return function () {
    // TODO: set initialState
    return usePresenceContext();
  };
}

export const usePresence = createPresenceHook();
