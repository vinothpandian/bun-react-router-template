import { notifications } from "@mantine/notifications";
import type { Route } from "./+types/home";
import { Button, Center, Flex, SimpleGrid } from "@mantine/core";
import { Link, useRevalidator } from "react-router";
import { signOut } from "~/lib/.client/auth";
import { AppConfig } from "~/lib/constants/config";
import { authGuard } from "~/lib/.server/utils/auth";

export function meta() {
  return [
    { title: AppConfig.Title },
    { name: "description", content: AppConfig.Description },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  return authGuard(request);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isSignedIn, user } = loaderData;
  const { revalidate } = useRevalidator();

  return (
    <Center>
      <Flex direction="column" align="center">
        <h1>Welcome to {AppConfig.Title}!</h1>
        {!isSignedIn && <Link to="/auth/login">Login</Link>}
        {isSignedIn && (
          <SimpleGrid>
            <p>Hello, {user.email}</p>
            <Button
              onClick={async () => {
                await signOut();
                notifications.show({
                  title: "Signed out",
                  message: "You have been signed out.",
                  color: "blue",
                });
                await revalidate();
              }}
            >
              Sign Out
            </Button>
          </SimpleGrid>
        )}
      </Flex>
    </Center>
  );
}
