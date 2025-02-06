import { authServer } from "~/lib/.server/auth";
import type { Route } from "./+types/api.auth.$";

export async function loader({ request }: Route.LoaderArgs) {
  return authServer.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
  return authServer.handler(request);
}
