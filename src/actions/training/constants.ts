export const TRAINING_SELECT_WITH_EXERCISES =
  "id, user_id, date, name, description, created_at, updated_at, exercises ( id, training_id, name, order_number, notes, created_at, updated_at, exercise_sets ( id, exercise_id, set_number, reps, weight, rest_time, completed, notes, created_at, updated_at ) )";
