import { useContext } from 'react';
import { PresenceContext } from '../components/Context';
import { usePresenceContext as useDefaultPresenceContext } from './usePresenceContext';

interface PresenceHook {
  (roomName: string): void;
}

export function createPresenceHook(context = PresenceContext) {
  const usePresenceContext: PresenceHook =
    context === PresenceContext
      ? useDefaultPresenceContext
      : () => useContext(context);

  // roomName: string, initialState: any
  return function(roomName: string) {
    // TODO: set initialState
    return usePresenceContext(roomName);
  };
}

export const usePresence = createPresenceHook();
