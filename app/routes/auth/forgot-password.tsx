import {
  Anchor,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { Route } from "../+types/home";
import { AppConfig } from "~/lib/constants/config";
import { Link } from "react-router";
import { AppRoutes } from "~/routes";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { useFetcher } from "react-router";
import { notifications } from "@mantine/notifications";
import { forgetPassword } from "~/lib/.client/auth";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export function meta() {
  return [{ title: `${AppConfig.Title} | Forgot Password` }];
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { email } = schema.parse(Object.fromEntries(formData));

  const { error } = await forgetPassword({
    email,
    redirectTo: AppRoutes.auth.resetPassword,
  });

  if (error) {
    notifications.show({
      title: "Unable to send reset email",
      message: error.message,
      color: "red",
    });

    return;
  }

  notifications.show({
    title: "Email sent",
    message: "Password reset email has been sent",
    color: "green",
  });

  return null;
}

export default function ForgotPassword() {
  const fetcher = useFetcher();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "vinoth@pandian.me",
    },
    validate: zodResolver(schema),
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Forgot your password?</Title>
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
        <TextInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@mantine.dev"
          required
          {...form.getInputProps("email")}
        />
        <Button
          type="submit"
          fullWidth
          mt="xl"
          loading={fetcher.state === "submitting"}
        >
          {fetcher.state !== "idle" ? "Sending..." : "Send reset link"}
        </Button>
      </Paper>
    </Container>
  );
}
