const DATE_DIVIDER_PATTERN = /^-+\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(.*?)\s*-+$/;
const CHAT_LINE_PATTERN = /^\[(.+?)\]\s\[(.+?)\]\s(.+)$/;
const PARSE_CHUNK_SIZE = 2000;

function parseHour(rawTime) {
  const amPmMatch = rawTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (amPmMatch) {
    const isPm = amPmMatch[1] === '오후';
    const hour12 = Number(amPmMatch[2]);
    if (Number.isNaN(hour12) || hour12 < 1 || hour12 > 12) {
      return null;
    }

    if (isPm) {
      return hour12 === 12 ? 12 : hour12 + 12;
    }

    return hour12 === 12 ? 0 : hour12;
  }

  const hour24Match = rawTime.match(/(\d{1,2}):(\d{2})/);
  if (!hour24Match) {
    return null;
  }

  const hour = Number(hour24Match[1]);
  return hour >= 0 && hour <= 23 ? hour : null;
}

function parseLine(line, dateState) {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('년') && trimmed.includes('월') && trimmed.includes('일')) {
    const dateMatch = trimmed.match(DATE_DIVIDER_PATTERN);
    if (dateMatch) {
      const year = Number(dateMatch[1]);
      const month = Number(dateMatch[2]);
      const day = Number(dateMatch[3]);
      if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        dateState.currentDateKey = `${year}-${paddedMonth}-${paddedDay}`;
        dateState.currentDateLabel = `${year}년 ${month}월 ${day}일${dateMatch[4] ? ` ${dateMatch[4].trim()}` : ''}`;
      }
      return null;
    }
  }

  if (!trimmed.startsWith('[')) {
    return null;
  }

  const match = trimmed.match(CHAT_LINE_PATTERN);
  if (!match) {
    return null;
  }

  const nickname = match[1].trim();
  const timeText = match[2].trim();
  const message = match[3];
  const hour = parseHour(timeText);
  if (hour === null) {
    return null;
  }

  return {
    nickname,
    hour,
    message,
    dateKey: dateState.currentDateKey,
    dateLabel: dateState.currentDateLabel,
  };
}

self.onmessage = (event) => {
  try {
    const text = typeof event.data?.text === 'string' ? event.data.text : '';
    const lines = text.split(/\r?\n/);
    const total = lines.length;
    const parsed = [];
    const dateState = { currentDateKey: null, currentDateLabel: null };

    self.postMessage({ type: 'progress', processed: 0, total });

    for (let index = 0; index < total; index += 1) {
      const entry = parseLine(lines[index], dateState);
      if (entry) {
        parsed.push(entry);
      }

      if (index > 0 && index % PARSE_CHUNK_SIZE === 0) {
        self.postMessage({ type: 'progress', processed: index, total });
      }
    }

    self.postMessage({ type: 'progress', processed: total, total });
    self.postMessage({ type: 'done', entries: parsed });
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown worker error',
    });
  }
};
