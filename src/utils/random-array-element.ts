interface RandomArrayElementReturn<T> {
  /**
   * The randomly picked element from the array.
   */
  element: T;
  /**
   * The rest of the array without the picked element.
   */
  left: T[];
}

export default function randomArrayElement<T>(
  array: T[],
  remove = false
): RandomArrayElementReturn<T> {
  const index = Math.floor(Math.random() * array.length);
  const element = array[index];
  if (remove) [...array].splice(index, 1);

  return {
    element: element,
    left: array,
  };
}
