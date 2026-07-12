import { CategoryPage } from '@/components/layout/CategoryPage';

export default function StringCategoryPage() {
  return (
    <CategoryPage
      categoryKey="string"
      tools={[
        { href: '/utils/discord-color-message-generator', toolKey: 'discordColorMessageGenerator' },
        { href: '/utils/escaped-string-decoder', toolKey: 'escapedStringDecoder' },
        { href: '/utils/kakaotalk-chat-analyzer', toolKey: 'kakaotalkChatAnalyzer' },
        { href: '/utils/csv-sorter', toolKey: 'csvSorter' },
      ]}
    />
  );
}
