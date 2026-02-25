export const ROUTES = {
  home: "/",
  protected: "/protected",
  auth: {
    login: "/auth/login",
    signUp: "/auth/sign-up",
    signUpSuccess: "/auth/sign-up-success",
    forgotPassword: "/auth/forgot-password",
    updatePassword: "/auth/update-password",
    confirm: "/auth/confirm",
    error: "/auth/error",
  },
} as const;
