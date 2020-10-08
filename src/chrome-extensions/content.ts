const key = 'contentScriptIsEnabledUntil';
const scriptEnableCheckInterval = 1000 * 30;
const isBrowserEnvironment = () => window && typeof window === 'object';
const getExpireAt = () => Date.now() + scriptEnableCheckInterval;
const setEnableFlag = () => {
  document.body.dataset[key] = String(getExpireAt());
};

const program = async () => {
  if (!isBrowserEnvironment()) {
    throw new Error('Not browser environment');
  }

  setEnableFlag();
  setInterval(setEnableFlag, scriptEnableCheckInterval);
};

program()
  .then(() => {
    console.log('program completed');
  })
  .catch((e) => {
    console.error('program errored', e);
  });
