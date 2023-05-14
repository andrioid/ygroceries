export function toArray<T>(arr: Record<string, T>) {
  if (!arr) return [];
  return Object.entries(arr).map(([, value]) => value) as Array<T>;
}
