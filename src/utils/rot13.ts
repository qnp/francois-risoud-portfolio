/**
 * Perform a rot13 transformation on a string.
 * @param string - Input string to transform.
 */
export default function rot13(string: string): string {
  return string.replace(/[a-zA-Z]/g, function (c: string | number) {
    return String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = String(c).charCodeAt(0) + 13)
        ? Number(c)
        : Number(c) - 26
    );
  });
}
