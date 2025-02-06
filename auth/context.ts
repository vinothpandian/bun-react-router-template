import type { AuthServer } from "../app/lib/.server/auth";
import { AsyncLocalStorage } from "node:async_hooks";

export const AuthContext = new AsyncLocalStorage<AuthServer>();

export function authContext() {
  const store = AuthContext.getStore();
  if (!store) {
    throw new Error("AuthContext not set");
  }
  return store;
}
