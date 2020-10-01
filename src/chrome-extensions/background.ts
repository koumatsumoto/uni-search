// NOTE: restrict to compare as lower-case
type AllowedHeaderName =
  | 'access-control-allow-origin'
  | 'access-control-allow-methods'
  | 'access-control-allow-credentials'
  | 'access-control-allow-headers'
  | 'access-control-expose-headers'
  | 'x-frame-options';

const remove = (headers: chrome.webRequest.HttpHeader[], name: AllowedHeaderName) => {
  const index = headers.findIndex((h) => h.name.toLowerCase() === name);
  if (index > -1) {
    headers.splice(index, 1);
  }
};

const upsert = (headers: chrome.webRequest.HttpHeader[], name: AllowedHeaderName, value: string) => {
  const header = headers.find((h) => h.name.toLowerCase() === name);
  if (header) {
    header.value = value;
  } else {
    headers.push({ name, value });
  }
};

chrome.webRequest.onHeadersReceived.addListener(
  ({ responseHeaders }) => {
    responseHeaders = responseHeaders || [];

    upsert(responseHeaders, 'access-control-allow-origin', '*');
    upsert(responseHeaders, 'access-control-allow-methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH');
    upsert(responseHeaders, 'access-control-allow-credentials', 'true');
    upsert(responseHeaders, 'access-control-allow-headers', '*');
    upsert(responseHeaders, 'access-control-expose-headers', '*');

    return { responseHeaders };
  },
  { urls: ['https://www.google.com/search?q=*'], types: ['xmlhttprequest'] },
  ['responseHeaders', 'blocking', 'extraHeaders'],
);

chrome.webRequest.onHeadersReceived.addListener(
  ({ responseHeaders }) => {
    responseHeaders = responseHeaders || [];

    remove(responseHeaders, 'x-frame-options');

    return { responseHeaders };
  },
  { urls: ['<all_urls>'], types: ['sub_frame'] },
  ['responseHeaders', 'blocking', 'extraHeaders'],
);
