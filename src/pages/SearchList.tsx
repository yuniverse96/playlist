import { useState } from 'react';
import type { PlaylistItemType } from '../types';
import PlaylistItem from '../components/Playlist';
import he from 'he';

type YoutubeItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: { url: string };
    };
  };
};

type Props = {
  onClose: () => void;
  onSelect: (item: PlaylistItemType) => void;
};

function SearchList({ onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YoutubeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
  
    try {
      setLoading(true);
      setIsSearched(true);
  
      const API_BASE = ''; // 프록시 설정 o, 상대 경로로 호출 가능
      const res = await fetch(`${API_BASE}/api/SearchYoutube?q=${encodeURIComponent(query)}`);

      if (!res.ok) {
        const text = await res.text();
        console.error('YouTube API error:', text);
  
        if (text.includes('quota')) {
          alert('오늘 할당량을 모두 사용했습니다. 내일 다시 시도해주세요.');
        } else {
          alert('검색 중 오류가 발생했습니다.');
        }
  
        setResults([]);
        return;
      }
  
      const items: YoutubeItem[] = await res.json();
      setResults(items);
    } catch (err) {
      console.error('Fetch failed', err);
      alert('검색 중 오류가 발생했습니다.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div id="pop_wrap">
      <div className="pop_box">
        <h3>search_music</h3>

        <div className="input_wrap">
          <input
            type="text"
            placeholder="노래나 가수 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="result_wrap">
          {loading && <p className="loading_text">검색 중...</p>}
          {results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <PlaylistItem
                  key={item.id.videoId}
                  title={he.decode(item.snippet.title)}
                  artist={he.decode(item.snippet.channelTitle)}
                  albumImg={item.snippet.thumbnails.medium.url}
                  variant="search"
                  onAdd={() => {
                    onSelect({
                      id: Date.now(),
                      title: he.decode(item.snippet.title),
                      artist: he.decode(item.snippet.channelTitle),
                      albumImg: item.snippet.thumbnails.medium.url,
                      videoId: item.id.videoId,
                    });
                  }}
                />
              ))}
            </ul>
          ) : (
            isSearched && !loading && (
              <p className="empty_result">앗! 찾으시는 음악이 없어요</p>
            )
          )}
        </div>

        <button className="close" type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default SearchList;
