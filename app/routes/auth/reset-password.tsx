import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
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
import { notifications } from "@mantine/notifications";
import { resetPassword } from "~/lib/.client/auth";

const schema = z
  .object({
    password: z.string().min(6, { message: "Password is too short" }),
    confirmPassword: z.string().min(6, { message: "Password is too short" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function meta() {
  return [{ title: `${AppConfig.Title} | Reset Password` }];
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { password } = schema.parse(Object.fromEntries(formData));

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  const { error } = await resetPassword({
    newPassword: password,
    token,
  });

  if (error) {
    notifications.show({
      title: "Unable to reset password",
      message: error.message,
      color: "red",
    });

    return;
  }

  notifications.show({
    title: "Password reset",
    message: "Your password has been reset",
    color: "green",
  });

  return redirect(AppRoutes.auth.login);
}

export default function ResetPassword() {
  const fetcher = useFetcher();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Reset your password</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Remembered your password?{" "}
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
        <PasswordInput
          name="password"
          label="New Password"
          placeholder="Your new password"
          required
          {...form.getInputProps("password")}
        />
        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
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
          {fetcher.state !== "idle" ? "Resetting..." : "Reset Password"}
        </Button>
      </Paper>
    </Container>
  );
}
