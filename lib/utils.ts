export function toArray<T>(arr: Record<string, T>) {
  return Object.entries(arr).map(([, value]) => value);
}
