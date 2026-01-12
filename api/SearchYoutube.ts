import type { VercelRequest, VercelResponse } from '@vercel/node';

type YoutubeItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string } };
  };
  //퍼가기 금지
  status?: {
    embeddable: boolean;
  };
};

const hasKorean = (text: string) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

const buildQuery = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return '';
  return hasKorean(trimmed) ? `${trimmed} official music` : trimmed;
};

const isOfficialVideo = (item: YoutubeItem) => {
  const title = item.snippet.title.toLowerCase();
  const channel = item.snippet.channelTitle.toLowerCase();
  const titleKeywords = ['official', 'mv', 'm/v', 'music video', 'audio', 'lyric'];
  const channelKeywords = ['official', 'music', 'entertainment', 'records', 'label'];

  return titleKeywords.some(k => title.includes(k)) || channelKeywords.some(k => channel.includes(k));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=59');

  const API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Missing API key' });

  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const finalQuery = buildQuery(query);

    //비디오 목록 호출
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=10&q=${encodeURIComponent(finalQuery)}&key=${API_KEY}`
    );
    
    if (!searchResponse.ok) throw new Error('Search API failed');
    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    //각 비디오의 'status' 퍼가기 가능 여부 확인
    const detailResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${videoIds}&key=${API_KEY}`
    );

    if (!detailResponse.ok) throw new Error('Detail API failed');
    const detailData = await detailResponse.json();

    //필터링: status.embeddable이 true인 영상만 추출
    //videos API=문자열
    const filteredItems: YoutubeItem[] = detailData.items
      .filter((item: any) => item.status.embeddable === true)
      .map((item: any) => ({
        id: { videoId: item.id },
        snippet: item.snippet
      }));

    //Official 영상 우선순위
    const officialItems = filteredItems.filter(isOfficialVideo);
    const result = officialItems.length >= 5 ? officialItems : filteredItems.slice(0, 10);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}