const container = 'div[role=main] div[data-async-context]';
// each search result item
const item = `${container} > .g:not(.g-blk)`;
const itemHeader = `${item} .r`;
const itemBody = `${item} .s`;
const itemLink = `${itemHeader} > a`;
const itemTitle = `${itemLink} > h3`;
const itemDescription = `${itemBody} span.st`;

export const googleSearchResultSelectors = {
  item,
  itemLink,
  itemTitle,
  itemDescription,
};
