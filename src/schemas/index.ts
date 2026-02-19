/**
 * Schemas module interface.
 * All validation schemas (Zod) are exported through this barrel file.
 */

export {
  CREATE_EXERCISE_SCHEMA,
  CREATE_EXERCISE_SET_SCHEMA,
  UPDATE_EXERCISE_SCHEMA,
} from "./exercise";
export { LOGIN_SCHEMA } from "./login";
export {
  REGISTER_SCHEMA,
  REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD,
} from "./register";
export { CREATE_TRAINING_SCHEMA, UPDATE_TRAINING_SCHEMA } from "./training";
