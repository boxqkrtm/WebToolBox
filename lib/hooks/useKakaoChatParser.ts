import { useEffect, useRef, useState } from 'react';
import type { ChatEntry } from '@/lib/kakaotalk/types';

const PARSER_WORKER_PATH = '/workers/kakaotalk-parser.worker.js';

type ParserWorkerResponse =
  | { type: 'progress'; processed: number; total: number }
  | { type: 'done'; entries: ChatEntry[] }
  | { type: 'error'; message?: string };

type UseKakaoChatParserResult = {
  entries: ChatEntry[];
  isParsing: boolean;
  parseProgress: number;
  parseStatusText: string;
  parseFromText: (sourceText: string) => Promise<ChatEntry[] | null>;
  parseFromFile: (file: File) => Promise<ChatEntry[] | null>;
};

export function useKakaoChatParser(): UseKakaoChatParserResult {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStatusText, setParseStatusText] = useState('');
  const parseJobRef = useRef(0);
  const parserWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (parserWorkerRef.current) {
        parserWorkerRef.current.terminate();
      }
    };
  }, []);

  const parseWithWorker = async (sourceText: string, currentJobId: number): Promise<ChatEntry[]> => {
    if (parserWorkerRef.current) {
      parserWorkerRef.current.terminate();
      parserWorkerRef.current = null;
    }

    return await new Promise<ChatEntry[]>((resolve, reject) => {
      const worker = new Worker(PARSER_WORKER_PATH);
      parserWorkerRef.current = worker;

      worker.onmessage = (event: MessageEvent<ParserWorkerResponse>) => {
        if (parseJobRef.current !== currentJobId) {
          return;
        }

        const data = event.data;
        if (data.type === 'progress') {
          if (data.total <= 0) {
            setParseProgress(100);
            return;
          }

          setParseProgress(Math.min(100, Math.floor((data.processed / data.total) * 100)));
          return;
        }

        if (data.type === 'done') {
          setParseProgress(100);
          worker.terminate();
          if (parserWorkerRef.current === worker) {
            parserWorkerRef.current = null;
          }
          resolve(data.entries);
          return;
        }

        worker.terminate();
        if (parserWorkerRef.current === worker) {
          parserWorkerRef.current = null;
        }
        reject(new Error(data.message || 'Failed to parse chat log'));
      };

      worker.onerror = () => {
        worker.terminate();
        if (parserWorkerRef.current === worker) {
          parserWorkerRef.current = null;
        }
        reject(new Error('Failed to initialize parser worker'));
      };

      setParseProgress(0);
      setParseStatusText('파싱 중...');
      worker.postMessage({ text: sourceText });
    });
  };

  const parseFromText = async (sourceText: string): Promise<ChatEntry[] | null> => {
    const currentJobId = parseJobRef.current + 1;
    parseJobRef.current = currentJobId;
    setIsParsing(true);
    setParseProgress(0);
    setParseStatusText('파싱 준비 중...');

    try {
      const parsed = await parseWithWorker(sourceText, currentJobId);
      if (parseJobRef.current !== currentJobId) {
        return null;
      }

      setEntries(parsed);
      setParseProgress(100);
      return parsed;
    } catch {
      if (parseJobRef.current === currentJobId) {
        setEntries([]);
        setParseProgress(0);
        setParseStatusText('파싱 실패');
      }
      return null;
    } finally {
      if (parseJobRef.current === currentJobId) {
        setIsParsing(false);
      }
    }
  };

  const parseFromFile = async (file: File): Promise<ChatEntry[] | null> => {
    setIsParsing(true);
    setParseProgress(0);
    setParseStatusText('파일 읽는 중...');

    try {
      const text = await file.text();
      return await parseFromText(text);
    } catch {
      setIsParsing(false);
      setParseProgress(0);
      setParseStatusText('파일 읽기 실패');
      return null;
    }
  };

  return {
    entries,
    isParsing,
    parseProgress,
    parseStatusText,
    parseFromText,
    parseFromFile,
  };
}
