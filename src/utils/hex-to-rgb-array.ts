export type RgbColorArray = [number, number, number];

export default function hexToRgbArray(hex: string): RgbColorArray {
  if (hex[0] !== '#' || hex.length !== 7) {
    throw new Error('hex color not in format #rrggbb');
  }

  const r = hex.substring(1, 3);
  const g = hex.substring(3, 5);
  const b = hex.substring(5, 7);

  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
