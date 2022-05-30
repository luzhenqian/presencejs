import { useContext } from 'react';
import { PresenceContext, PresenceContextValue } from '../components/Context';

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
export function usePresenceContext(): PresenceContextValue | null {
  const contextValue = useContext(PresenceContext);

  if (!contextValue) {
    throw new Error(
      'could not find presence context value; please ensure the component is wrapped in a <Provider>'
    );
  }

  return contextValue;
}
