import { env } from "./env.js";
import { idlFactory } from "../declarations/backend/backend.did.js";

export const canisters = {
  backend: { canisterId: env.BACKEND_CANISTER_ID, idl: idlFactory },
};
