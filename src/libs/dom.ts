export const findOrFail = <T extends Element = Element>(selector: string, element: HTMLElement) => {
  const result = element.querySelector(selector);
  if (!result) {
    throw new Error(`ElementNotFound: \`${selector}\``);
  }

  return result as T;
};
