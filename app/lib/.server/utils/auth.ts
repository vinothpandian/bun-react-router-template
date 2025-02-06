import type { User } from "better-auth";
import { authContext } from "~/auth/context";

type AuthGuardResponse = Promise<
  | {
      isSignedIn: false;
      user?: never;
    }
  | {
      isSignedIn: true;
      user: User;
    }
>;

export async function authGuard(request: Request): AuthGuardResponse {
  const auth = authContext();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return {
      isSignedIn: false,
    };
  }

  return {
    isSignedIn: true,
    user: session?.user,
  };
}
