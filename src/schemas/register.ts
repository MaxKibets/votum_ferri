import z from "zod";
import { AUTH_FIELD_NAME } from "@/constants";

export const REGISTER_SCHEMA = z.object({
  [AUTH_FIELD_NAME.EMAIL]: z.email("Invalid email format"),
  [AUTH_FIELD_NAME.PASSWORD]: z.string().min(8, "Password must be at least 8 characters"),
  [AUTH_FIELD_NAME.NAME]: z.string().max(255, "Name must be at most 255 characters").optional(),
});

export const REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD = REGISTER_SCHEMA
  .extend({
    [AUTH_FIELD_NAME.CONFIRM_PASSWORD]: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data[AUTH_FIELD_NAME.PASSWORD] === data[AUTH_FIELD_NAME.CONFIRM_PASSWORD], {
    message: "Passwords do not match",
    path: [AUTH_FIELD_NAME.CONFIRM_PASSWORD],
  });
