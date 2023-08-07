import millisecondsToMinutes from 'date-fns/millisecondsToMinutes';
import millisecondsToSeconds from 'date-fns/millisecondsToSeconds';

export function renderDurationInMinutes(ms) {
  if (ms <= 0) {
    return '0:00';
  }
  const minutes = millisecondsToMinutes(ms);
  const seconds = `${millisecondsToSeconds(ms) % 60}`.padStart(2, '0');
  return `${minutes}:${seconds}`;
}
