import { useState, useEffect, useRef } from 'react';
import type { PlaylistItemType } from '../types';
import PlaylistItem from '../components/Playlist';
import he from 'he';
import gsap from 'gsap';

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
  const loadingTextRef = useRef<HTMLParagraphElement>(null);

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
  //로딩중 텍스트 이펙트
  useEffect(() => {
    if (loading && loadingTextRef.current) {
      // 모든 글자 span 요소들을 선택
      const chars = loadingTextRef.current.querySelectorAll('.loading_char');

      gsap.fromTo(
        chars,
        { y: 0 },
        {
          y: -10, // 위로 10px 움직임
          repeat: -1,
          yoyo: true, // 갔다가 다시 돌아옴
          ease: 'sine.inOut',
          stagger: 0.1, // 각 글자가 0.1초씩 지연되어 애니메이션 시작
          duration: 0.6, // 각 글자의 움직임 시간
        }
      );
    } else {
      // 로딩이 끝나면 애니메이션 멈춤
      gsap.killTweensOf(loadingTextRef.current);
    }

    // 컴포넌트 언마운트 또는 loading 상태 변경 시 애니메이션 정리
    return () => {
      gsap.killTweensOf(loadingTextRef.current);
    };
  }, [loading]); // loading 상태가 바뀔 때마다 useEffect 재실행
  

  return (
    <div id="pop_wrap">
      <div className="pop_box">
          <div className="card_wrap">
            <div className="input_wrap">
              <label>요청곡 : </label>
              <input
                type="text"
                placeholder="제목이나 가수 + press enter"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="result_wrap">
                {loading ? (
                  <p className="loading_text" ref={loadingTextRef}>
                    {'노래 찾는 중...'.split('').map((char, index) => (
                      <span key={index} className="loading_char">
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </p>
                ) : (
                  <>
                    {/*결과가 있을 때 */}
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
                                id: Date.now() + Math.random(), // 중복 방지
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
                      /*결과가 없을 때 (검색을 한 번이라도 했을 경우만) */
                      isSearched && (
                        <p className="empty_result">앗! 찾으시는 음악이 없어요</p>
                      )
                    )}
                  </>
                )}
            </div>
      </div>

        <button className="close" type="button" onClick={onClose}>
          <img src="/images/close.svg" alt="닫기"/>
        </button>
      </div>
    </div>
  );
}

export default SearchList;
