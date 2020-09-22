import { googleSearchResultSelectors } from './dom-selector';
import { findOrFail } from '../../../libs/dom';

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

export const extractResult = (html: string) => {
  const div = createElement(html);
  try {
    document.body.appendChild(div);
  } catch {
    throw new Error('InvalidHtmlError');
  }

  const success: SearchResult[] = [];
  const error: Error[] = [];
  const ignore: { reason: string }[] = [];
  try {
    const items = Array.from(div.querySelectorAll<HTMLElement>(googleSearchResultSelectors.item));
    items.forEach((item, index) => {
      try {
        if (item.classList.length > 1) {
          ignore.push({ reason: `index:${index} is many classes in addition to .g` });
          return;
        }

        success.push(extract(item));
      } catch (e) {
        error.push(new Error(`UnexpectedModel: { index:${index}, message: ${e.message}`));
      }
    });

    return { success, error, ignore };
  } finally {
    document.body.removeChild(div);
  }
};
