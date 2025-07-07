import { Actor, AnonymousIdentity, HttpAgent } from "@dfinity/agent";

import { canisters } from "@/lib/canisters";
import { env } from "@/lib/env";
import useAuthStore from "@/store/auth-store";
import { useMemo } from "react";

export function useCanister(canisterName = "backend") {
  const { identity } = useAuthStore();
  const { canisterId, idl } = canisters[canisterName];

  const host = env.DFX_NETWORK === "local" ? "http://localhost:4943" : "https://ic0.app";

  const agent = useMemo(
    () =>
      HttpAgent.createSync({
        host,
        identity: identity.data || new AnonymousIdentity(),
        shouldFetchRootKey: host.includes("localhost"),
      }),
    [host, identity.data]
  );

  if (host.includes("localhost")) {
    agent.fetchRootKey().catch((err) => {
      console.error("Failed to fetch root key:", err);
    });
  }

  const actor = useMemo(
    () =>
      Actor.createActor(idl, {
        agent,
        canisterId,
      }),
    [canisterId, idl, agent]
  );

  return [actor];
}

export default useCanister;
