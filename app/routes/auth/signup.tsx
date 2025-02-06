import {
  Anchor,
  Button,
  Container,
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
import { signUp } from "~/lib/.client/auth";
import { notifications } from "@mantine/notifications";

const schema = z
  .object({
    name: z.string().min(2, { message: "Name is too short" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password is too short" }),
    confirmPassword: z.string().min(6, { message: "Password is too short" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function meta() {
  return [{ title: `${AppConfig.Title} | Signup` }];
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { name, email, password } = schema.parse(Object.fromEntries(formData));

  const { error } = await signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    notifications.show({
      title: "Unable to sign up",
      message: error.message,
      color: "red",
    });
    return;
  }

  notifications.show({
    title: "Account created",
    message: "You can now sign in to your account",
    color: "green",
  });

  return redirect(AppRoutes.auth.login);
}

export default function Signup() {
  const fetcher = useFetcher();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "Vinoth Pandian",
      email: "vinoth@pandian.me",
      password: "29a-w3urfhjszdijn",
      confirmPassword: "29a-w3urfhjszdijn",
    },
    validate: zodResolver(schema),
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an account on {AppConfig.Title}!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to={AppRoutes.auth.login}>
          Sign in
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
          name="name"
          label="Name"
          placeholder="Your name"
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@mantine.dev"
          required
          mt="md"
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
        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          mt="md"
          {...form.getInputProps("confirmPassword")}
        />
        <Button
          type="submit"
          fullWidth
          mt="xl"
          loading={fetcher.state === "submitting"}
        >
          {fetcher.state !== "idle" ? "Signing up..." : "Sign up"}
        </Button>
      </Paper>
    </Container>
  );
}
