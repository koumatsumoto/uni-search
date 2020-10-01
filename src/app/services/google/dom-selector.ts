const container = 'div[role=main] div[data-async-context]';
// each search result item
const item = `${container} > .g`;
const itemLink = `${item} a`;
const itemTitle = `${item} h3`;
const itemDescription = `${item} div.rc > div:nth-child(1)`;

export const googleSearchResultSelectors = {
  item,
  itemLink,
  itemTitle,
  itemDescription,
};
