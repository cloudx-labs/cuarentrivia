export const buildObject = <T = unknown>(defaults: T) => (
  data?: Partial<T>
) => ({
  ...defaults,
  ...data,
});
