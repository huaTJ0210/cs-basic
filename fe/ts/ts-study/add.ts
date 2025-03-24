export function add(item: number, ...rest: number[]) {
  return rest.reduce((a, b) => a + b, item)
}
