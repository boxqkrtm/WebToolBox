export type ChatEntry = {
  nickname: string;
  hour: number;
  message: string;
  dateKey: string | null;
  dateLabel: string | null;
};

export type RankingItem = {
  nickname: string;
  count: number;
};

export type MessageRankingItem = {
  message: string;
  count: number;
};
