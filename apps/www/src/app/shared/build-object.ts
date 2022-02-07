import { Buildable } from './common';

export const buildObject =
  <T extends Buildable>(defaults: T) =>
  (data?: Partial<T>) => ({ ...defaults, ...data });
