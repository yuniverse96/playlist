import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.YOUTUBE_API_KEY;

type YoutubeItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string } };
  };
};

// 한글 포함 여부
const hasKorean = (text: string) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

// 검색어 빌드
const buildQuery = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return '';
  return hasKorean(trimmed) ? `${trimmed} official music` : trimmed;
};

// official 느낌 나는 영상 판별
const isOfficialVideo = (item: YoutubeItem) => {
  const title = item.snippet.title.toLowerCase();
  const channel = item.snippet.channelTitle.toLowerCase();

  const titleKeywords = ['official', 'mv', 'm/v', 'music video', 'audio', 'lyric'];
  const channelKeywords = ['official', 'music', 'entertainment', 'records', 'label'];

  return titleKeywords.some(k => title.includes(k)) || channelKeywords.some(k => channel.includes(k));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const finalQuery = buildQuery(query);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=25&order=relevance&regionCode=KR&relevanceLanguage=ko&q=${encodeURIComponent(finalQuery)}&key=${API_KEY}`
    );

    if (!response.ok) {
      const text = await response.text();

      // quotaExceeded 처리
      if (text.includes('quotaExceeded')) {
        return res.status(429).json({
          error: 'YouTube API quota exceeded',
          message: '오늘 할당량을 모두 사용했습니다. 내일 다시 시도해주세요.',
        });
      }

      return res.status(500).json({ error: 'YouTube API error', detail: text });
    }

    const data = await response.json();
    const officialItems: YoutubeItem[] = data.items.filter(isOfficialVideo);
    const result = officialItems.length >= 5 ? officialItems : data.items.slice(0, 10);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err });
  }
}
