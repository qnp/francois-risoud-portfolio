export default function hexToArray(hex) {
  if (hex[0] !== '#' || hex.length !== 7)
    throw new Error('hex color not in good format #rrggbb');

  const r = hex.substr(1, 2);
  const g = hex.substr(3, 2);
  const b = hex.substr(5, 2);

  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
