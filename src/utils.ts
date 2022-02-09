export function pad(n: number) {
  return String("0000000" + n).slice(-7);
}
