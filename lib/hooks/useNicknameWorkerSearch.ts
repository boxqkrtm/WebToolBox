import { useCallback, useEffect, useRef, useState } from 'react';

type NicknameWorkerResponse =
  | { type: 'ready' }
  | { type: 'results'; requestId: number; results: string[] };

const SEARCH_DEBOUNCE_MS = 1000;

type UseNicknameWorkerSearchResult = {
  query: string;
  setQuery: (value: string) => void;
  results: string[];
  isSearching: boolean;
  resetQuery: () => void;
};

export function useNicknameWorkerSearch(nicknames: string[]): UseNicknameWorkerSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>(nicknames);
  const [isSearching, setIsSearching] = useState(false);
  const nicknameWorkerRef = useRef<Worker | null>(null);
  const nicknameSearchRequestIdRef = useRef(0);
  const nicknameSearchTimerRef = useRef<number | null>(null);
  const nicknameSearchWatchdogRef = useRef<number | null>(null);
  const nicknamesRef = useRef<string[]>(nicknames);
  const queryRef = useRef<string>('');

  useEffect(() => {
    nicknamesRef.current = nicknames;
  }, [nicknames]);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    return () => {
      if (nicknameWorkerRef.current) {
        nicknameWorkerRef.current.terminate();
      }
      if (nicknameSearchTimerRef.current !== null) {
        window.clearTimeout(nicknameSearchTimerRef.current);
      }
      if (nicknameSearchWatchdogRef.current !== null) {
        window.clearTimeout(nicknameSearchWatchdogRef.current);
      }
    };
  }, []);

  const ensureNicknameWorker = () => {
    if (nicknameWorkerRef.current) {
      return nicknameWorkerRef.current;
    }

    if (typeof Worker === 'undefined') {
      return null;
    }

    const worker = new Worker('/workers/nickname-search.worker.js');
    nicknameWorkerRef.current = worker;

    worker.onmessage = (event: MessageEvent<NicknameWorkerResponse>) => {
      const data = event.data;
      if (data.type === 'ready') {
        return;
      }

      if (data.type === 'results' && data.requestId === nicknameSearchRequestIdRef.current) {
        setResults(data.results);
        setIsSearching(false);
        if (nicknameSearchWatchdogRef.current !== null) {
          window.clearTimeout(nicknameSearchWatchdogRef.current);
          nicknameSearchWatchdogRef.current = null;
        }
      }
    };

    worker.onerror = () => {
      worker.terminate();
      if (nicknameWorkerRef.current === worker) {
        nicknameWorkerRef.current = null;
      }

      const fallbackQuery = queryRef.current.trim().toLowerCase();
      const fallback = fallbackQuery
        ? nicknamesRef.current.filter((nickname) => nickname.toLowerCase().includes(fallbackQuery))
        : nicknamesRef.current;
      setResults(fallback);
      setIsSearching(false);
    };

    worker.postMessage({ type: 'setData', nicknames: nicknamesRef.current });
    return worker;
  };

  useEffect(() => {
    const worker = ensureNicknameWorker();
    if (worker) {
      worker.postMessage({ type: 'setData', nicknames });
    }

    setResults(nicknames);
    setIsSearching(false);
    nicknameSearchRequestIdRef.current += 1;
  }, [nicknames]);

  useEffect(() => {
    const worker = ensureNicknameWorker();
    if (nicknameSearchTimerRef.current !== null) {
      window.clearTimeout(nicknameSearchTimerRef.current);
    }
    if (nicknameSearchWatchdogRef.current !== null) {
      window.clearTimeout(nicknameSearchWatchdogRef.current);
      nicknameSearchWatchdogRef.current = null;
    }

    const requestId = nicknameSearchRequestIdRef.current + 1;
    nicknameSearchRequestIdRef.current = requestId;

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setResults(nicknames);
      setIsSearching(false);
      return;
    }

    nicknameSearchTimerRef.current = window.setTimeout(() => {
      if (nicknameSearchRequestIdRef.current !== requestId) {
        return;
      }

      setIsSearching(true);

      if (!worker) {
        const fallback = nicknames.filter((nickname) => nickname.toLowerCase().includes(normalizedQuery));
        setResults(fallback);
        setIsSearching(false);
        return;
      }

      worker.postMessage({ type: 'search', requestId, query: normalizedQuery });

      nicknameSearchWatchdogRef.current = window.setTimeout(() => {
        if (nicknameSearchRequestIdRef.current !== requestId) {
          return;
        }

        const fallback = nicknames.filter((nickname) => nickname.toLowerCase().includes(normalizedQuery));
        setResults(fallback);
        setIsSearching(false);
      }, 1200);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (nicknameSearchTimerRef.current !== null) {
        window.clearTimeout(nicknameSearchTimerRef.current);
        nicknameSearchTimerRef.current = null;
      }
      if (nicknameSearchWatchdogRef.current !== null) {
        window.clearTimeout(nicknameSearchWatchdogRef.current);
        nicknameSearchWatchdogRef.current = null;
      }
    };
  }, [query, nicknames]);

  const resetQuery = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    resetQuery,
  };
}
