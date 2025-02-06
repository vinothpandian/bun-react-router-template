import type { User } from "better-auth";
import { env } from "server/env";
import { Resend } from "resend";
import { notifications } from "@mantine/notifications";
import { AppConfig } from "~/lib/constants/config";

type SendResetPasswordRequest = {
  user: User;
  url: string;
  token: string;
};

export async function sendResetPassword({
  user,
  url,
  token,
}: SendResetPasswordRequest) {
  if (env.NODE_ENV === "development") {
    console.log(
      `Reset password link: ${url}?token=${token}. This link will expire in 1 hour.`,
    );
  }

  if (env.NODE_ENV === "production") {
    const resend = new Resend(env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `${AppConfig.Title} <noreply@${AppConfig.Title.toLowerCase()}.com>`,
      to: [user.email],
      subject: "Reset password",
      text: `Reset password link: ${url}?token=${token}. This link will expire in 1 hour.`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  notifications.show({
    title: "Reset password",
    message: "An email with the reset password link has been sent.",
    color: "green",
  });
}
