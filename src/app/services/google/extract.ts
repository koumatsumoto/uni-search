import { googleSearchResultSelectors } from './dom-selector';

export type SearchResult = {
  readonly domain: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export const emptyResult: SearchResult = {
  domain: '',
  title: '',
  description: '',
  href: '',
} as const;

const findOrFail = <T extends Element = Element>(selector: string, element: HTMLElement) => {
  const result = element.querySelector(selector);
  if (!result) {
    throw new Error(`ElementNotFound: selector is ${selector}`);
  }

  return result as T;
};

const extract = (element: HTMLElement) => {
  const title = findOrFail<HTMLHeadingElement>(googleSearchResultSelectors.itemTitle, element);
  const link = findOrFail<HTMLAnchorElement>(googleSearchResultSelectors.itemLink, element);
  const description = findOrFail<HTMLSpanElement>(googleSearchResultSelectors.itemDescription, element);
  const url = new URL(link.href);

  return {
    domain: url.hostname,
    title: title.innerText,
    description: description.innerText,
    href: url.href,
  } as const;
};

const createElement = (html: string) => {
  const div = document.createElement('div');
  div.style.display = 'none';
  div.innerHTML = html;

  return div;
};

export const extractResult = (html: string): SearchResult[] => {
  const div = createElement(html);
  try {
    document.body.appendChild(div);
  } catch {
    throw new Error('InvalidHtmlError');
  }

  try {
    const items = div.querySelectorAll<HTMLElement>(googleSearchResultSelectors.item);

    return Array.from(items).map((item) => extract(item));
  } catch {
    throw new Error('UnexpectedStructError');
  } finally {
    document.body.removeChild(div);
  }
};
