let nicknameList = [];

self.onmessage = (event) => {
  const data = event.data || {};

  if (data.type === 'setData') {
    nicknameList = Array.isArray(data.nicknames) ? data.nicknames : [];
    self.postMessage({ type: 'ready' });
    return;
  }

  if (data.type === 'search') {
    const query = typeof data.query === 'string' ? data.query.trim().toLowerCase() : '';
    const requestId = typeof data.requestId === 'number' ? data.requestId : 0;

    if (!query) {
      self.postMessage({ type: 'results', requestId, results: nicknameList });
      return;
    }

    const results = [];
    for (let i = 0; i < nicknameList.length; i += 1) {
      const nickname = nicknameList[i];
      if (nickname.toLowerCase().includes(query)) {
        results.push(nickname);
      }
    }

    self.postMessage({ type: 'results', requestId, results });
  }
};
