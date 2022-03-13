export default function uniqueID() {
  return '_' + Math.random().toString(36).substring(2, 9);
}
