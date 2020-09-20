const setHeader = (headers: chrome.webRequest.HttpHeader[], name: string, value: string) => {
  const target = headers.find((h) => h.name.toLowerCase() === name);
  if (target) {
    target.value = value;
  } else {
    headers.push({ name, value });
  }
};

const removeHeader = (headers: chrome.webRequest.HttpHeader[], name: 'origin' | 'x-frame-options') => {
  const index = headers.findIndex((h) => h.name.toLowerCase() === name);
  if (index > -1) {
    headers.splice(index, 1);
  }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const headers = details.requestHeaders || [];
    removeHeader(headers, 'origin');

    return { responseHeaders: headers };
  },
  { urls: ['*://*/*'], types: ['xmlhttprequest'] },
  ['requestHeaders', 'blocking', 'extraHeaders'],
);

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const headers = details.responseHeaders || [];
    removeHeader(headers, 'x-frame-options');

    return { responseHeaders: headers };
  },
  { urls: ['*://*/*'], types: ['sub_frame'] },
  ['responseHeaders', 'blocking'],
);
