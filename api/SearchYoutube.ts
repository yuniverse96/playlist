import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  // 엣지 캐싱 설정 (응답 시작 부분에 추가)
  // s-maxage=3600: Vercel 서버(엣지)에 1시간 동안 보관
  // stale-while-revalidate=59: 캐시가 만료되어도 59초 동안은 예전 데이터를 보여주며 백그라운드에서 갱신
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=59');

const API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;

  if (!API_KEY) {
    console.error('YOUTUBE_API_KEY is missing!');
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
  }

  console.log('API_KEY 존재 여부:', !!API_KEY);

  try {
    const query = req.query.q as string;
    if (!query) {
      console.log('쿼리 없음');
      return res.status(400).json({ error: 'Missing query' });
    }

    const finalQuery = buildQuery(query);
    console.log('finalQuery:', finalQuery);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=10&order=relevance&regionCode=KR&relevanceLanguage=ko&q=${encodeURIComponent(finalQuery)}&key=${API_KEY}`
    );
    console.log('API 호출 완료, status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('YouTube API 오류:', text);

      if (text.includes('quotaExceeded')) {
        return res.status(429).json({
          error: 'YouTube API quota exceeded',
          message: '오늘 할당량을 모두 사용했습니다. 내일 다시 시도해주세요.',
        });
      }

      return res.status(500).json({ error: 'YouTube API error', detail: text });
    }

    const data = await response.json();
    console.log('받은 데이터 items 수:', data.items.length);

    const officialItems: YoutubeItem[] = data.items.filter(isOfficialVideo);
    const result = officialItems.length >= 5 ? officialItems : data.items.slice(0, 10);
    console.log('최종 결과 items 수:', result.length);

    res.status(200).json(result);
  } catch (err) {
    console.error('서버 에러 발생:', err);
    res.status(500).json({ error: 'Server error', detail: String(err) });
  } finally {
    console.log('=== API 호출 종료 ===');
  }
}
