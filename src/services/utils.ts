type Response<E extends { reason: string }, R> = [E, null] | [null, R];

export function ok<S>(data: S): Response<never, S> {
  return [null, data];
}

export function err<const R extends string, E extends { reason: R }>(
  data: E,
): Response<E, never> {
  return [data, null];
}
