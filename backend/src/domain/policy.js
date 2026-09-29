export class AppError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const fail = (condition, status, message) => { if (!condition) throw new AppError(status, message); };
export const transitions = Object.freeze({ Received: ['Assigned', 'Rejected'], Assigned: ['In progress'], 'In progress': ['Resolved'], Resolved: ['Closed'], Closed: [], Rejected: [] });
export const openStatuses = ['Received', 'Assigned', 'In progress'];
export function text(value, name, max, required = true) {
  fail(typeof value === 'string', 400, `${name} must be text`);
  const result = value.trim();
  fail((!required || result.length > 0) && result.length <= max, 400, `${name} must contain ${required ? '1' : '0'} to ${max} characters`);
  return result;
}
export function positiveId(value) { fail(Number.isSafeInteger(value) && value > 0, 400, 'Invalid identifier'); return value; }
export function priority(value) { fail(['Low','Normal','High'].includes(value), 400, 'Invalid priority'); return value; }
export function futureDate(value, now) {
  fail(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value), 400, 'Due date requires a timezone');
  const date = new Date(value);
  fail(Number.isFinite(date.getTime()) && date > new Date(now), 400, 'Due date must be in the future');
  return date.toISOString();
}
export function transition(from, to, note) {
  fail(transitions[from]?.includes(to), 400, `Cannot move from ${from} to ${to}`);
  if (['Rejected','Resolved'].includes(to)) text(note, 'Reason or resolution summary', 2000);
  return to;
}
