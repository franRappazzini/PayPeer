import { useEffect, useState } from "react";

import { AuthClient } from "@dfinity/auth-client";
import useAuthStore from "@/store/auth-store";
import useCanister from "./use-canister";

export function useAuth() {
  const [authClient, setAuthClient] = useState(null);
  const { principal, setPrincipal, setUser } = useAuthStore();
  const [backend] = useCanister();

  const login = async () => {
    if (!authClient) return;

    await authClient.login({
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal(), identity);
        getUser();
      },
      onError: (error) => {
        console.error("Login failed:", error);
        setPrincipal(null, null);
        setUser(null);
      },
      windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100",
    });
  };

  const disconnect = async () => {
    if (!authClient) return;
    await authClient.logout();
    setPrincipal(null, null);
    setUser(null);
  };

  const getUser = async () => {
    if (!authClient) return null;

    try {
      const user = await backend.get_user(authClient.getIdentity().getPrincipal());
      console.log({ user });
      if (user.length) {
        setUser(user[0]);
      } else {
        const newUser = await backend?.new_user([]);
        console.log({ newUser });
        setUser(newUser);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      !authClient && setAuthClient(await AuthClient.create());

      if (await authClient?.isAuthenticated()) {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal(), identity);
        getUser();
      } else {
        setPrincipal(null, null);
        setUser(null);
      }
    })();
  }, [authClient]);

  return { authClient, login, disconnect, principal };
}
