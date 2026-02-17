import z from "zod";
import { AUTH_FIELD_NAME } from "@/constants";

export const LOGIN_SCHEMA = z.object({
  [AUTH_FIELD_NAME.EMAIL]: z.email("Invalid email format"),
  [AUTH_FIELD_NAME.PASSWORD]: z.string().min(1, "Password is required"),
});
