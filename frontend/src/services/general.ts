export function randomString(
  length: number,
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
) {
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const getElementBoundingRect = (elementClass: string) => {
  const implTextElement = document.getElementsByClassName(elementClass);

  // .height.toFixed(0)
  return implTextElement.length
    ? implTextElement[0].getBoundingClientRect() : null;
};
