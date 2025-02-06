import { createRequestHandler } from "@react-router/express";
import express from "express";
import "react-router";
import { authServer } from "~/lib/.server/auth";

import { db } from "~/lib/.server/db";
import { AuthContext } from "~/auth/context";
import { DatabaseContext } from "~/database/context";

export const app = express();

app.use((_, __, next) => DatabaseContext.run(db, next));
app.use((_, __, next) => AuthContext.run(authServer, next));

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
  }),
);
