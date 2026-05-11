export function formatDuration(ms) {
  if (ms === null || ms === undefined || Number.isNaN(Number(ms))) {
    return "—";
  }

  const duration = Math.max(0, Number(ms));

  const totalSeconds = duration / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} h`);
  }

  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes} min`);
  }

  if (hours === 0 && minutes === 0) {
    parts.push(`${seconds.toFixed(seconds < 10 ? 1 : 0)} s`);
  } else {
    parts.push(`${Math.round(seconds)} s`);
  }

  return parts.join(" ");
}
