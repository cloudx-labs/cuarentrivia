export const buildObject = <T extends Record<string, unknown>>(defaults: T) => (
  data?: Partial<T>
) => ({ ...defaults, ...data });
