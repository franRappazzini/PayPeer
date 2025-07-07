import { create } from "zustand";
import { p2str } from "@/lib/parsers";
import { parseUser } from "@/lib/parsers";

const useAuthStore = create((set) => ({
  principal: { loading: true, data: null, error: false },
  identity: { loading: true, data: null, error: false },
  user: { loading: true, data: null, error: false },

  setPrincipal: (principal, identity) =>
    set({
      principal: { loading: false, data: principal ? p2str(principal) : null, error: false },
      identity: { loading: false, data: identity, error: false },
    }),
  setUser: (user) =>
    set({ user: { loading: false, data: user ? parseUser(user) : null, error: false } }),
}));

export default useAuthStore;
