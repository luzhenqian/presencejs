import { useContext } from "react";
import { PresenceContext } from "../components/Context";

export function usePresenceContext() {
  const contextValue = useContext(PresenceContext);

  if (!contextValue) {
    throw new Error(
      "could not find presence context value; please ensure the component is wrapped in a <Provider>"
    );
  }

  return contextValue;
}
