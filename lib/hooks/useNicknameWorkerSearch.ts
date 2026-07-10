import { useCallback, useEffect, useRef, useState } from 'react';

type NicknameWorkerResponse =
  | { type: 'ready' }
  | { type: 'results'; requestId: number; results: string[] };

type NicknameSearchState = {
  nicknames: string[];
  results: string[];
  isSearching: boolean;
};

const SEARCH_DEBOUNCE_MS = 1000;

type UseNicknameWorkerSearchResult = {
  query: string;
  setQuery: (value: string) => void;
  results: string[];
  isSearching: boolean;
  resetQuery: () => void;
};

export function useNicknameWorkerSearch(nicknames: string[]): UseNicknameWorkerSearchResult {
  const [query, setQueryState] = useState('');
  const [searchState, setSearchState] = useState<NicknameSearchState>(() => ({
    nicknames,
    results: nicknames,
    isSearching: false,
  }));
  const nicknameWorkerRef = useRef<Worker | null>(null);
  const nicknameSearchRequestIdRef = useRef(0);
  const nicknameSearchTimerRef = useRef<number | null>(null);
  const nicknameSearchWatchdogRef = useRef<number | null>(null);
  const nicknamesRef = useRef<string[]>(nicknames);
  const queryRef = useRef<string>('');

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
        setSearchState({
          nicknames: nicknamesRef.current,
          results: data.results,
          isSearching: false,
        });
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
      const currentNicknames = nicknamesRef.current;
      const fallback = fallbackQuery
        ? currentNicknames.filter((nickname) => nickname.toLowerCase().includes(fallbackQuery))
        : currentNicknames;
      setSearchState({
        nicknames: currentNicknames,
        results: fallback,
        isSearching: false,
      });
    };

    worker.postMessage({ type: 'setData', nicknames: nicknamesRef.current });
    return worker;
  };

  useEffect(() => {
    nicknamesRef.current = nicknames;
    const worker = ensureNicknameWorker();
    if (worker) {
      worker.postMessage({ type: 'setData', nicknames });
    }

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
      return;
    }

    nicknameSearchTimerRef.current = window.setTimeout(() => {
      if (nicknameSearchRequestIdRef.current !== requestId) {
        return;
      }

      setSearchState((current) => ({
        nicknames,
        results: current.nicknames === nicknames ? current.results : nicknames,
        isSearching: true,
      }));

      if (!worker) {
        const fallback = nicknames.filter((nickname) => nickname.toLowerCase().includes(normalizedQuery));
        setSearchState({
          nicknames,
          results: fallback,
          isSearching: false,
        });
        return;
      }

      worker.postMessage({ type: 'search', requestId, query: normalizedQuery });

      nicknameSearchWatchdogRef.current = window.setTimeout(() => {
        if (nicknameSearchRequestIdRef.current !== requestId) {
          return;
        }

        const fallback = nicknames.filter((nickname) => nickname.toLowerCase().includes(normalizedQuery));
        setSearchState({
          nicknames,
          results: fallback,
          isSearching: false,
        });
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

  const setQuery = useCallback((value: string) => {
    if (value === queryRef.current) {
      return;
    }

    queryRef.current = value;
    setQueryState(value);
    if (!value.trim()) {
      const currentNicknames = nicknamesRef.current;
      setSearchState({
        nicknames: currentNicknames,
        results: currentNicknames,
        isSearching: false,
      });
    }
  }, []);

  const resetQuery = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  const normalizedQuery = query.trim().toLowerCase();
  const hasCurrentSearchState = searchState.nicknames === nicknames;
  const results = normalizedQuery && hasCurrentSearchState ? searchState.results : nicknames;
  const isSearching = Boolean(normalizedQuery && hasCurrentSearchState && searchState.isSearching);

  return {
    query,
    setQuery,
    results,
    isSearching,
    resetQuery,
  };
}
