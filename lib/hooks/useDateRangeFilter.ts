import { useEffect, useMemo, useState } from 'react';
import type { ChatEntry } from '@/lib/kakaotalk/types';

type DatePreset = 'all' | 'last7' | 'last30' | 'thisYear';

function shiftDateKey(dateKey: string, days: number): string {
  const parsed = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateKey;
  }

  parsed.setDate(parsed.getDate() + days);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentYearRange(): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  };
}

function getDateBoundsFromEntries(entries: ChatEntry[]): { min: string; max: string } {
  let min = '';
  let max = '';

  for (const entry of entries) {
    if (!entry.dateKey) {
      continue;
    }

    if (!min || entry.dateKey < min) {
      min = entry.dateKey;
    }
    if (!max || entry.dateKey > max) {
      max = entry.dateKey;
    }
  }

  return { min, max };
}

type UseDateRangeFilterResult = {
  startDateKey: string;
  endDateKey: string;
  setStartDateKey: (value: string) => void;
  setEndDateKey: (value: string) => void;
  dateOptions: Array<{ key: string; label: string }>;
  minDateKey: string;
  maxDateKey: string;
  displayStartDate: string;
  displayEndDate: string;
  filteredEntries: ChatEntry[];
  applyDatePreset: (preset: DatePreset) => void;
};

export function useDateRangeFilter(entries: ChatEntry[]): UseDateRangeFilterResult {
  const [startDateKey, setStartDateKey] = useState('');
  const [endDateKey, setEndDateKey] = useState('');

  const dateOptions = useMemo(() => {
    const dateMap = new Map<string, string>();
    for (const entry of entries) {
      if (entry.dateKey && !dateMap.has(entry.dateKey)) {
        dateMap.set(entry.dateKey, entry.dateLabel || entry.dateKey);
      }
    }

    return Array.from(dateMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, label]) => ({ key, label }));
  }, [entries]);

  const minDateKey = dateOptions.length > 0 ? dateOptions[0].key : '';
  const maxDateKey = dateOptions.length > 0 ? dateOptions[dateOptions.length - 1].key : '';

  useEffect(() => {
    const bounds = getDateBoundsFromEntries(entries);
    setStartDateKey(bounds.min);
    setEndDateKey(bounds.max);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!startDateKey && !endDateKey) {
      return entries;
    }

    let from = startDateKey;
    let to = endDateKey;
    if (from && to && from > to) {
      from = endDateKey;
      to = startDateKey;
    }

    return entries.filter((entry) => {
      if (!entry.dateKey) {
        return false;
      }
      if (from && entry.dateKey < from) {
        return false;
      }
      if (to && entry.dateKey > to) {
        return false;
      }
      return true;
    });
  }, [entries, startDateKey, endDateKey]);

  const dateLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const dateOption of dateOptions) {
      map.set(dateOption.key, dateOption.label);
    }
    return map;
  }, [dateOptions]);

  const applyDatePreset = (preset: DatePreset) => {
    if (!minDateKey || !maxDateKey) {
      return;
    }

    if (preset === 'all') {
      setStartDateKey(minDateKey);
      setEndDateKey(maxDateKey);
      return;
    }

    if (preset === 'thisYear') {
      const currentYearRange = getCurrentYearRange();
      const start = currentYearRange.start < minDateKey ? minDateKey : currentYearRange.start;
      const end = currentYearRange.end > maxDateKey ? maxDateKey : currentYearRange.end;

      if (start > end) {
        setStartDateKey(minDateKey);
        setEndDateKey(maxDateKey);
        return;
      }

      setStartDateKey(start);
      setEndDateKey(end);
      return;
    }

    const days = preset === 'last7' ? 7 : 30;
    const from = shiftDateKey(maxDateKey, -(days - 1));
    setStartDateKey(minDateKey && from < minDateKey ? minDateKey : from);
    setEndDateKey(maxDateKey);
  };

  return {
    startDateKey,
    endDateKey,
    setStartDateKey,
    setEndDateKey,
    dateOptions,
    minDateKey,
    maxDateKey,
    displayStartDate: startDateKey ? (dateLabelMap.get(startDateKey) || startDateKey) : '시작 날짜 선택',
    displayEndDate: endDateKey ? (dateLabelMap.get(endDateKey) || endDateKey) : '종료 날짜 선택',
    filteredEntries,
    applyDatePreset,
  };
}
