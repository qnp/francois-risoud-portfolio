export default function randomArrayElement(array, remove = false) {
  const index = Math.floor(Math.random() * array.length);
  const element = array[index];
  if (remove) array.splice(index, 1);

  return {
    element: element,
    left: array,
  };
}
