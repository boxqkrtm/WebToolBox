import { useEffect, useMemo, useState } from 'react';
import UtilsLayout from '@/components/layout/UtilsLayout';
import { useI18n } from '@/lib/i18n/i18nContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useKakaoChatParser } from '@/lib/hooks/useKakaoChatParser';
import { useDateRangeFilter } from '@/lib/hooks/useDateRangeFilter';
import { useNicknameWorkerSearch } from '@/lib/hooks/useNicknameWorkerSearch';
import type { MessageRankingItem, RankingItem } from '@/lib/kakaotalk/types';

const CHART_COLORS = ['#0f766e', '#0ea5e9', '#f59e0b', '#22c55e', '#f97316', '#14b8a6', '#64748b', '#84cc16'];
const USER_ROW_HEIGHT = 36;
const USER_LIST_HEIGHT = 224;
const USER_LIST_OVERSCAN = 6;

function BarChart({ title, items, color }: { title: string; items: Array<{ label: string; value: number }>; color: string }) {
  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="grid grid-cols-[36px_1fr_56px] items-center gap-3 text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <div className="h-3 rounded bg-muted">
                <div
                  className="h-3 rounded"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="text-right font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function KakaotalkChatAnalyzer() {
  const { t } = useI18n();
  const [rawText, setRawText] = useState('');
  const [selectedNickname, setSelectedNickname] = useState('');
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [userListScrollTop, setUserListScrollTop] = useState(0);

  const {
    entries,
    isParsing,
    parseProgress,
    parseStatusText,
    parseFromText,
  } = useKakaoChatParser();

  const {
    startDateKey,
    endDateKey,
    setStartDateKey,
    setEndDateKey,
    dateOptions,
    minDateKey,
    maxDateKey,
    displayStartDate,
    displayEndDate,
    filteredEntries,
    applyDatePreset,
  } = useDateRangeFilter(entries);

  const nicknames = useMemo(() => {
    return Array.from(new Set(filteredEntries.map((entry) => entry.nickname))).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [filteredEntries]);

  const {
    query: nicknameQuery,
    setQuery: setNicknameQuery,
    results: filteredNicknames,
    isSearching: isSearchingNickname,
    resetQuery,
  } = useNicknameWorkerSearch(nicknames);

  const visibleUserRange = useMemo(() => {
    const total = filteredNicknames.length;
    if (total === 0) {
      return { start: 0, end: 0 };
    }

    const visibleCount = Math.ceil(USER_LIST_HEIGHT / USER_ROW_HEIGHT);
    const baseStart = Math.floor(userListScrollTop / USER_ROW_HEIGHT);
    const start = Math.max(0, baseStart - USER_LIST_OVERSCAN);
    const end = Math.min(total, start + visibleCount + USER_LIST_OVERSCAN * 2);
    return { start, end };
  }, [filteredNicknames.length, userListScrollTop]);

  const visibleNicknames = useMemo(() => {
    return filteredNicknames.slice(visibleUserRange.start, visibleUserRange.end);
  }, [filteredNicknames, visibleUserRange]);

  useEffect(() => {
    if (selectedNickname && !nicknames.includes(selectedNickname)) {
      setSelectedNickname('');
      resetQuery();
    }
  }, [nicknames, selectedNickname, resetQuery]);

  useEffect(() => {
    setUserListScrollTop(0);
  }, [nicknameQuery]);

  const ranking = useMemo<RankingItem[]>(() => {
    const counts = new Map<string, number>();
    for (const entry of filteredEntries) {
      counts.set(entry.nickname, (counts.get(entry.nickname) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([nickname, count]) => ({ nickname, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEntries]);

  const messageRanking = useMemo<MessageRankingItem[]>(() => {
    const counts = new Map<string, number>();
    for (const entry of filteredEntries) {
      const normalizedMessage = entry.message.trim();
      if (!normalizedMessage) {
        continue;
      }
      counts.set(normalizedMessage, (counts.get(normalizedMessage) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEntries]);

  const hourlyActivity = useMemo(() => {
    const counts = Array(24).fill(0) as number[];
    for (const entry of filteredEntries) {
      counts[entry.hour] += 1;
    }
    return counts.map((value, hour) => ({ label: `${String(hour).padStart(2, '0')}`, value }));
  }, [filteredEntries]);

  const hourlyActiveUsers = useMemo(() => {
    const usersByHour = Array.from({ length: 24 }, () => new Set<string>());
    for (const entry of filteredEntries) {
      usersByHour[entry.hour].add(entry.nickname);
    }
    return usersByHour.map((users, hour) => ({ label: `${String(hour).padStart(2, '0')}`, value: users.size }));
  }, [filteredEntries]);

  const selectedUserHourlyActivity = useMemo(() => {
    const counts = Array(24).fill(0) as number[];
    for (const entry of filteredEntries) {
      if (selectedNickname && entry.nickname === selectedNickname) {
        counts[entry.hour] += 1;
      }
    }
    return counts.map((value, hour) => ({ label: `${String(hour).padStart(2, '0')}`, value }));
  }, [filteredEntries, selectedNickname]);

  const selectedUserTopMessages = useMemo(() => {
    if (!selectedNickname) {
      return [] as MessageRankingItem[];
    }

    const counts = new Map<string, number>();
    for (const entry of filteredEntries) {
      if (entry.nickname !== selectedNickname) {
        continue;
      }

      const message = entry.message.trim();
      if (!message) {
        continue;
      }
      counts.set(message, (counts.get(message) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredEntries, selectedNickname]);

  const donutData = useMemo(() => {
    const top = messageRanking.slice(0, 8);
    const total = messageRanking.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) {
      return { gradient: '#e2e8f0', legend: [] as Array<MessageRankingItem & { color: string; share: string }> };
    }

    let start = 0;
    const segments: string[] = [];
    const legend = top.map((item, index) => {
      const portion = (item.count / total) * 100;
      const end = start + portion;
      const color = CHART_COLORS[index % CHART_COLORS.length];
      segments.push(`${color} ${start}% ${end}%`);
      start = end;
      return {
        ...item,
        color,
        share: `${portion.toFixed(1)}%`,
      };
    });

    return { gradient: `conic-gradient(${segments.join(', ')})`, legend };
  }, [messageRanking]);

  const handleAnalyzeText = async () => {
    const parsed = await parseFromText(rawText);
    if (!parsed) {
      return;
    }
    setSelectedNickname('');
    resetQuery();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    setRawText(text);
    const parsed = await parseFromText(text);
    if (!parsed) {
      return;
    }
    setSelectedNickname('');
    resetQuery();
  };

  const applyPresetAndClose = (preset: 'all' | 'last7' | 'last30' | 'thisYear') => {
    applyDatePreset(preset);
    setIsStartDatePopoverOpen(false);
    setIsEndDatePopoverOpen(false);
  };

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('common.tools.kakaotalkChatAnalyzer.title')}</CardTitle>
            <CardDescription>{t('common.tools.kakaotalkChatAnalyzer.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chat-file">채팅 로그 파일 업로드 (.txt)</Label>
              <Input id="chat-file" type="file" accept=".txt" onChange={handleFileUpload} disabled={isParsing} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-text">또는 채팅 로그 직접 붙여넣기</Label>
              <textarea
                id="chat-text"
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                className="w-full min-h-40 rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="[닉네임] [오전 9:12] 메시지"
                disabled={isParsing}
              />
              <Button onClick={handleAnalyzeText} disabled={isParsing}>
                {isParsing ? '파싱 중...' : '분석 시작'}
              </Button>
            </div>

            {isParsing && (
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-muted">
                  <div className="h-2 rounded bg-foreground transition-all" style={{ width: `${parseProgress}%` }} />
                </div>
                <p className="text-sm text-muted-foreground">{parseStatusText || '파싱 중...'} {parseProgress}%</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">지원 형식 예시: [홍길동] [오후 3:45] 안녕하세요</p>
            <p className="text-sm text-muted-foreground">파싱된 메시지 수: <span className="font-medium text-foreground">{entries.length}</span></p>
            <p className="text-sm text-muted-foreground">현재 분석 대상 메시지 수: <span className="font-medium text-foreground">{filteredEntries.length}</span></p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => applyPresetAndClose('all')} disabled={!dateOptions.length}>전체</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyPresetAndClose('last7')} disabled={!dateOptions.length}>최근 7일</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyPresetAndClose('last30')} disabled={!dateOptions.length}>최근 30일</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyPresetAndClose('thisYear')} disabled={!dateOptions.length}>올해</Button>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="start-date-picker">시작 날짜</Label>
                <Button id="start-date-picker" type="button" variant="outline" className="w-full justify-between" onClick={() => setIsStartDatePopoverOpen((open) => !open)} disabled={!dateOptions.length}>
                  <span className="truncate">{displayStartDate}</span>
                  <span className="text-muted-foreground">열기</span>
                </Button>
                {isStartDatePopoverOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border bg-background p-3 shadow-md">
                    <div className="space-y-2">
                      <Input type="date" value={startDateKey} onChange={(event) => setStartDateKey(event.target.value)} min={minDateKey || undefined} max={maxDateKey || undefined} />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setStartDateKey(minDateKey)} disabled={!minDateKey}>최소</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsStartDatePopoverOpen(false)}>닫기</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="end-date-picker">종료 날짜</Label>
                <Button id="end-date-picker" type="button" variant="outline" className="w-full justify-between" onClick={() => setIsEndDatePopoverOpen((open) => !open)} disabled={!dateOptions.length}>
                  <span className="truncate">{displayEndDate}</span>
                  <span className="text-muted-foreground">열기</span>
                </Button>
                {isEndDatePopoverOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border bg-background p-3 shadow-md">
                    <div className="space-y-2">
                      <Input type="date" value={endDateKey} onChange={(event) => setEndDateKey(event.target.value)} min={minDateKey || undefined} max={maxDateKey || undefined} />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setEndDateKey(maxDateKey)} disabled={!maxDateKey}>최대</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsEndDatePopoverOpen(false)}>닫기</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredEntries.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">유저별 검색 시간대 활동</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="nickname-select">유저 선택</Label>
                <div className="space-y-2 sm:w-80">
                  <Input id="nickname-select" value={nicknameQuery} onChange={(event) => setNicknameQuery(event.target.value)} placeholder="유저 검색 (중간 검색 지원)" />
                  {isSearchingNickname && <p className="text-xs text-muted-foreground">검색 중...</p>}
                  <div className="rounded-md border bg-background">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNickname('');
                        resetQuery();
                      }}
                      className="w-full border-b px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      미선택 (총 고유 활동 인원 {nicknames.length}명)
                    </button>
                    {filteredNicknames.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">검색 결과가 없습니다.</div>
                    ) : (
                      <div
                        className="overflow-y-auto"
                        style={{ maxHeight: `${USER_LIST_HEIGHT}px` }}
                        onScroll={(event) => setUserListScrollTop(event.currentTarget.scrollTop)}
                      >
                        <div
                          className="relative"
                          style={{ height: `${filteredNicknames.length * USER_ROW_HEIGHT}px` }}
                        >
                          {visibleNicknames.map((nickname, index) => {
                            const absoluteIndex = visibleUserRange.start + index;
                            return (
                              <button
                                key={`${nickname}-${absoluteIndex}`}
                                type="button"
                                onClick={() => setSelectedNickname(nickname)}
                                className="absolute left-0 right-0 px-3 text-left text-sm hover:bg-muted"
                                style={{
                                  top: `${absoluteIndex * USER_ROW_HEIGHT}px`,
                                  height: `${USER_ROW_HEIGHT}px`,
                                }}
                              >
                                {nickname}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedNickname && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <BarChart title={`${selectedNickname} 시간별 활동 량 (메시지 수)`} items={selectedUserHourlyActivity} color="#0ea5e9" />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedNickname} 많이 보낸 메시지 종류</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">순위</TableHead>
                          <TableHead>메시지</TableHead>
                          <TableHead className="text-right">횟수</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedUserTopMessages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">메시지 데이터가 없습니다.</TableCell>
                          </TableRow>
                        ) : (
                          selectedUserTopMessages.map((item, index) => (
                            <TableRow key={`${item.message}-${index}`}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="max-w-[360px] break-all">{item.message}</TableCell>
                              <TableCell className="text-right">{item.count}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <BarChart title="시간별 활동 인원 (고유 유저 수)" items={hourlyActiveUsers} color="#22c55e" />
              <BarChart title="시간별 활동 량 (메시지 수)" items={hourlyActivity} color="#f59e0b" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">유저 활동량 순위 (메시지 수)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">순위</TableHead>
                      <TableHead>닉네임</TableHead>
                      <TableHead className="text-right">메시지 수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ranking.slice(0, 20).map((item, index) => (
                      <TableRow key={item.nickname}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.nickname}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">가장 많이 나온 메시지 순위</CardTitle>
                <CardDescription>순위 테이블 + 도넛 차트</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative h-56 w-56 rounded-full" style={{ background: donutData.gradient }} aria-label="메시지 빈도 점유율 도넛 차트">
                      <div className="absolute inset-8 rounded-full bg-background border" />
                    </div>
                    <div className="w-full space-y-1 text-sm">
                      {donutData.legend.map((item, index) => (
                        <div key={`${item.message}-${index}`} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="max-w-56 truncate">{index + 1}. {item.message}</span>
                          </div>
                          <span className="text-muted-foreground">{item.share}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">순위</TableHead>
                        <TableHead>메시지</TableHead>
                        <TableHead className="text-right">등장 횟수</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messageRanking.slice(0, 20).map((item, index) => (
                        <TableRow key={`${item.message}-${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="max-w-[560px] break-all">{item.message}</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </UtilsLayout>
  );
}
