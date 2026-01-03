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

      // 서버리스 함수 호출
      const res = await fetch(`/api/SearchYoutube?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('youtube search fail');

      const items: YoutubeItem[] = await res.json();
      setResults(items);
    } catch (e) {
      console.error(e);
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
