// UTC, yyyy.mm.dd
export function formatTime(timestamp: number) {
  const date = new Date(timestamp);

  let month: string | number = date.getUTCMonth() + 1;
  month = month < 10 ? `0${month}` : `${month}`;

  let day: string | number = date.getUTCDate();
  day = day < 10 ? `0${day}` : `${day}`;

  return `${date.getUTCFullYear()}.${month}.${day}`;
}
