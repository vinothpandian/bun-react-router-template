import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const RootRoutes = {
  root: "/",
  auth: "/auth",
  betterAuth: "api/auth/*",
};

export const AppRoutes = {
  root: RootRoutes.root,
  auth: {
    login: `${RootRoutes.auth}/login`,
    signup: `${RootRoutes.auth}/signup`,
    forgotPassword: `${RootRoutes.auth}/forgot-password`,
    resetPassword: `${RootRoutes.auth}/reset-password`,
  },
};

export default [
  index("routes/home.tsx"),
  // BetterAuth routes
  route("api/auth/*", "routes/api.auth.$.ts"),
  // Auth routes
  layout("routes/auth/layout.tsx", [
    route(AppRoutes.auth.login, "routes/auth/login.tsx"),
    route(AppRoutes.auth.signup, "routes/auth/signup.tsx"),
    route(AppRoutes.auth.forgotPassword, "routes/auth/forgot-password.tsx"),
    route(AppRoutes.auth.resetPassword, "routes/auth/reset-password.tsx"),
  ]),
] satisfies RouteConfig;
