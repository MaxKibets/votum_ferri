export const DASHBOARD_PATH = "/dashboard";
export const AUTH_PATH = "/auth";

export const QUERY_PARAM = {
  MODE: "mode",
} as const;

export const AUTH_MODE = {
  LOGIN: "login",
  REGISTER: "register",
} as const;

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_PATH}?${QUERY_PARAM.MODE}=${AUTH_MODE.LOGIN}`,
  REGISTER: `${AUTH_PATH}?${QUERY_PARAM.MODE}=${AUTH_MODE.REGISTER}`,
} as const;
