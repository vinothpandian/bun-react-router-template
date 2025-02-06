import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { Route } from "../+types/home";
import { AppConfig } from "~/lib/constants/config";
import { Link, redirect } from "react-router";
import { AppRoutes } from "~/routes";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { useFetcher } from "react-router";
import { signIn } from "~/lib/.client/auth";
import { notifications } from "@mantine/notifications";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password is too short" }),
});

export function meta() {
  return [{ title: `${AppConfig.Title} | Login` }];
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { email, password } = schema.parse(Object.fromEntries(formData));

  const { error } = await signIn.email({
    email,
    password,
  });

  if (error) {
    notifications.show({
      title: "Unable to sign in",
      message: error.message,
      color: "red",
    });

    return;
  }

  notifications.show({
    title: "Signed in",
    message: "You are now signed in",
    color: "green",
  });

  return redirect(AppRoutes.root);
}

export default function Login() {
  const fetcher = useFetcher();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "vinoth@pandian.me",
      password: "29a-w3urfhjszdijn",
    },
    validate: zodResolver(schema),
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back to {AppConfig.Title}!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component={Link} to={AppRoutes.auth.signup}>
          Create account
        </Anchor>
      </Text>

      <Paper
        component={fetcher.Form}
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        onSubmit={form.onSubmit((values) => {
          fetcher.submit(values, { method: "post" });
        })}
      >
        <TextInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@mantine.dev"
          required
          {...form.getInputProps("email")}
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps("password")}
        />
        <Group justify="space-between" mt="lg">
          <Anchor size="sm" component={Link} to={AppRoutes.auth.forgotPassword}>
            Forgot password?
          </Anchor>
        </Group>
        <Button
          type="submit"
          fullWidth
          mt="xl"
          loading={fetcher.state === "submitting"}
        >
          {fetcher.state !== "idle" ? "Signing in..." : "Sign in"}
        </Button>
      </Paper>
    </Container>
  );
}
