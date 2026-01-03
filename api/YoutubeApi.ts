const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/** YouTube 검색 결과 타입 */
export type YoutubeItem = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
};

/** 한글 포함 여부 */
const hasKorean = (text: string) => {
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
};

/** 검색어 빌드 */
const buildQuery = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return '';

  // 한글이면 official music 자동 추가
  if (hasKorean(trimmed)) {
    return `${trimmed} official music`;
  }

  return trimmed;
};

/** official 느낌 나는 영상 판별 */
const isOfficialVideo = (item: YoutubeItem) => {
  const title = item.snippet.title.toLowerCase();
  const channel = item.snippet.channelTitle.toLowerCase();

  const titleKeywords = [
    'official',
    'mv',
    'm/v',
    'music video',
    'audio',
    'lyric',
  ];

  const channelKeywords = [
    'official',
    'music',
    'entertainment',
    'records',
    'label',
  ];

  const hasTitleKeyword = titleKeywords.some(keyword =>
    title.includes(keyword)
  );

  const hasChannelKeyword = channelKeywords.some(keyword =>
    channel.includes(keyword)
  );

  return hasTitleKeyword || hasChannelKeyword;
};

/** 유튜브 음악 검색 (official 위주 + fallback) */
export const searchYoutube = async (
  query: string
): Promise<YoutubeItem[]> => {
  if (!API_KEY) {
    throw new Error('VITE_YOUTUBE_API_KEY is missing');
  }

  const finalQuery = buildQuery(query);
  if (!finalQuery) return [];

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search
      ?part=snippet
      &type=video
      &videoCategoryId=10
      &maxResults=25
      &order=relevance
      &regionCode=KR
      &relevanceLanguage=ko
      &q=${encodeURIComponent(finalQuery)}
      &key=${API_KEY}`.replace(/\s/g, '')
  );

  if (!res.ok) {
    throw new Error('youtube search fail');
  }

  const data = await res.json();

  const officialItems: YoutubeItem[] = data.items.filter(isOfficialVideo);

  // 충분히 나오면 official만
  if (officialItems.length >= 5) {
    return officialItems;
  }

  // 아니면 fallback
  return data.items.slice(0, 10);
};
