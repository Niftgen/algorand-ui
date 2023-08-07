import formatRelative from 'date-fns/formatRelative';

export function renderDate({timestamp}) {
  return timestamp ? formatRelative(new Date(timestamp), new Date()) : 'Unknown';
}
