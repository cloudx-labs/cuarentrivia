export const buildObject = <T extends {}>(defaults: T) => (
  data?: Partial<T>
) => ({ ...defaults, ...data });
