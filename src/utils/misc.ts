export function prettyNumber(num: bigint | number | string) {
  return num.toString().replace(/(?=(?!^)(\d{3})+$)/g, ",");
}
