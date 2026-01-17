import { loginUser, registerUser } from "@/actions/auth";
import { AUTH_FIELD_NAME } from "@/constants/authFieldNames";
import { LOGIN_SCHEMA, REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD } from "@/constants/authValidationSchemas";
import { ROUTE } from "@/constants/routes";

export const LOGIN_FIELDS_DATA = [
  {
    name: AUTH_FIELD_NAME.EMAIL,
    label: AUTH_FIELD_NAME.EMAIL.toUpperCase(),
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: AUTH_FIELD_NAME.PASSWORD,
    label: AUTH_FIELD_NAME.PASSWORD.toUpperCase(),
    type: "password",
    placeholder: "••••••••",
    autoComplete: "current-password",
  },
] as const;

export const REGISTER_FIELDS_DATA = [
  {
    name: AUTH_FIELD_NAME.NAME,
    label: "Name (optional)",
    type: "text",
    placeholder: "John Doe",
    autoComplete: "name",
  },
  {
    name: AUTH_FIELD_NAME.EMAIL,
    label: AUTH_FIELD_NAME.EMAIL.toUpperCase(),
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: AUTH_FIELD_NAME.PASSWORD,
    label: AUTH_FIELD_NAME.PASSWORD.toUpperCase(),
    type: "password",
    placeholder: "••••••••",
    autoComplete: "new-password",
  },
  {
    name: AUTH_FIELD_NAME.CONFIRM_PASSWORD,
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
    autoComplete: "new-password",
  },
] as const;

export const LOGIN_FORM_DATA = {
  title: "Sign in",
  description: "Enter your credentials to access your account",
  footerText: "Don't have an account?",
  footerLinkText: "Sign up",
  footerLinkHref: ROUTE.REGISTER,
  formData: {
    fields: LOGIN_FIELDS_DATA,
    action: loginUser,
    schema: LOGIN_SCHEMA,
    buttonText: "Sign in",
  }
}

export const REGISTER_FORM_DATA = {
  title: "Create an account",
  description: "Enter your information to create your account",
  buttonText: "Create account",
  footerText: "Already have an account?",
  footerLinkText: "Sign in",
  footerLinkHref: ROUTE.LOGIN,
  formData: {
    fields: REGISTER_FIELDS_DATA,
    action: registerUser,
    schema: REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD,
    buttonText: "Create account",
  }
}