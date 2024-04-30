/**
 * Simple unique ID generator
 */
export default function uniqueId(): string {
  return '_' + Math.random().toString(36).substring(2, 9);
}
