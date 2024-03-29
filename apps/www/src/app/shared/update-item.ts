export const updatePrimitiveItemAt = <T>(list: T[], index: number, data: T) => [
  ...list.slice(0, index),
  data,
  ...list.slice(index + 1),
];
