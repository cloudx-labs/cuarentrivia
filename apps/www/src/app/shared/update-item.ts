export const updateObjectItemAt = <T extends {}>(
  list: T[],
  index: number,
  data: Partial<T>
) => [
  ...list.slice(0, index),
  { ...list[index], ...data },
  ...list.slice(index + 1),
];

export const updatePrimitiveItemAt = <T>(list: T[], index: number, data: T) => [
  ...list.slice(0, index),
  data,
  ...list.slice(index + 1),
];
