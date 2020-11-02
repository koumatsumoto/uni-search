import { findOrFail } from '../../../libs/dom';
import { SearchResult } from '../../models/core';
import { googleSearchResultSelectors } from './dom-selector';

const extract = (element: HTMLElement) => {
  const title = findOrFail<HTMLHeadingElement>(googleSearchResultSelectors.itemTitle, element);
  const link = findOrFail<HTMLAnchorElement>(googleSearchResultSelectors.itemLink, element);
  const description = findOrFail<HTMLSpanElement>(googleSearchResultSelectors.itemDescription, element);
  const url = new URL(link.href);

  return {
    title: title.innerText,
    description: description.innerText,
    domain: url.hostname,
    uri: url.href,
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
