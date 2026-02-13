export type RouteMeta = {
  slug: string;
  title: string;
  description: string;
  section?: string;
};

const defaultMeta: RouteMeta = {
  slug: "default",
  title: "Web Tool Box",
  description: "A collection of useful web tools and utilities.",
  section: "Utilities",
};

const routeMetaMap: Record<string, RouteMeta> = {
  "/": {
    slug: "home",
    title: "Web Utils",
    description: "A collection of useful tools and utilities.",
    section: "Home",
  },
  "/category/database": {
    slug: "category-database",
    title: "Database Tools",
    description: "Tools for JSON, CSV, and SQL database workflows.",
    section: "Category",
  },
  "/category/game": {
    slug: "category-game",
    title: "Game Tools",
    description: "Utilities for replay editing and puzzle game workflows.",
    section: "Category",
  },
  "/category/image-video": {
    slug: "category-image-video",
    title: "Image & Video Tools",
    description: "Tools for image conversion, QR processing, and video editing.",
    section: "Category",
  },
  "/category/llm": {
    slug: "category-llm",
    title: "LLM Tools",
    description: "Utilities for large language model calculations and workflows.",
    section: "Category",
  },
  "/category/geolocation": {
    slug: "category-geolocation",
    title: "Geolocation Tools",
    description: "Tools for coordinates and GNSS/NTRIP related tasks.",
    section: "Category",
  },
  "/category/etc": {
    slug: "category-etc",
    title: "Miscellaneous Tools",
    description: "Other utility tools for text, chat, and numeric workflows.",
    section: "Category",
  },
  "/utils/xlsx-to-sql": {
    slug: "xlsx-to-sql",
    title: "XLSX to SQL",
    description: "Convert Excel files to SQL statements quickly.",
    section: "Database",
  },
  "/utils/video-cutter-encoder": {
    slug: "video-cutter-encoder",
    title: "Video Cutter Encoder",
    description: "Cut and encode video segments in your browser.",
    section: "Image & Video",
  },
  "/utils/tetrio-replay-editor": {
    slug: "tetrio-replay-editor",
    title: "Tetrio Replay Editor",
    description: "Edit and export Tetrio replay files.",
    section: "Game",
  },
  "/utils/qr-code-generator": {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    description: "Generate and read QR codes from text or images.",
    section: "Image & Video",
  },
  "/utils/optical-puyo-reader": {
    slug: "optical-puyo-reader",
    title: "Optical Puyo Reader",
    description: "Read Puyo game boards from screenshots.",
    section: "Game",
  },
  "/utils/ntrip-scanner": {
    slug: "ntrip-scanner",
    title: "NTRIP Scanner",
    description: "Scan NTRIP casters for available mount points.",
    section: "Geolocation",
  },
  "/utils/llm-vram-calculator": {
    slug: "llm-vram-calculator",
    title: "LLM VRAM Calculator",
    description: "Estimate VRAM requirements for LLM inference.",
    section: "LLM",
  },
  "/utils/kakaotalk-chat-analyzer": {
    slug: "kakaotalk-chat-analyzer",
    title: "KakaoTalk Chat Analyzer",
    description: "Analyze rankings and activity from KakaoTalk chat logs.",
    section: "Etc",
  },
  "/utils/kakaomap-coord-opener": {
    slug: "kakaomap-coord-opener",
    title: "KakaoMap Coord Opener",
    description: "Open latitude and longitude directly in KakaoMap.",
    section: "Geolocation",
  },
  "/utils/image-to-base64": {
    slug: "image-to-base64",
    title: "Image to Base64",
    description: "Convert image files to Base64 output.",
    section: "Image & Video",
  },
  "/utils/escaped-string-decoder": {
    slug: "escaped-string-decoder",
    title: "Escaped String Decoder",
    description: "Decode escaped strings into readable text.",
    section: "Database",
  },
  "/utils/discord-color-message-generator": {
    slug: "discord-color-message-generator",
    title: "Discord Color Message Generator",
    description: "Generate ANSI styled color text for Discord.",
    section: "Etc",
  },
  "/utils/csv-sorter": {
    slug: "csv-sorter",
    title: "CSV Sorter",
    description: "Sort CSV data with flexible column options.",
    section: "Database",
  },
  "/utils/booth-algorithm-multiplier": {
    slug: "booth-algorithm-multiplier",
    title: "Booth Algorithm Multiplier",
    description: "Multiply binary values using Booth's algorithm.",
    section: "Etc",
  },
};

export function normalizePathname(input: string): string {
  const pathOnly = input.split("#")[0].split("?")[0] || "/";
  if (pathOnly === "/") return "/";
  return pathOnly.endsWith("/") ? pathOnly.slice(0, -1) : pathOnly;
}

export function getRouteMeta(pathname: string): RouteMeta {
  const normalizedPath = normalizePathname(pathname);
  return routeMetaMap[normalizedPath] ?? defaultMeta;
}

