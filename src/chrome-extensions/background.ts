const setHeader = (headers: chrome.webRequest.HttpHeader[], name: string, value: string) => {
  const target = headers.find((h) => h.name === name);
  if (target) {
    target.value = value;
  } else {
    headers.push({ name, value });
  }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    console.log('[dev] onBeforeRequest', details);

    const headers = details.requestHeaders || [];

    setHeader(headers, 'Origin', 'https://www.google.com');
  },
  { urls: ['https://www.google.com/*'], types: ['xmlhttprequest'] },
  ['requestHeaders', 'blocking', 'extraHeaders'],
);
