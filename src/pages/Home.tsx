import { useState } from 'react';
import PlaylistItem from '../components/Playlist';
import SearchList from './SearchList';
import type { PlaylistItemType } from '../types';

function Home() {
  // 곡 검색 팝업 상태
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // 음악 리스트
  const [playlist, setPlaylist] = useState<PlaylistItemType[]>([]);
  // 재생중인곡 인덱스
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // 음악 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);

  // 음악 추가 팝업
  const handleAddMusic = (item: PlaylistItemType) => {
    setPlaylist((prev) => [...prev, item]);
    setIsSearchOpen(false);
  };

  // 음악 삭제 기능
  const handleRemoveMusic = (id: number) => {
    setPlaylist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div id="main">
        <section className="left">
          <h2>my playlist</h2>

          <div className="total_info">
            <span>now</span>
            <p>{playlist.length}</p>
          </div>

          <div className="list_wrap">
            {playlist.length > 0 ? (
              <ul>
                {playlist.map((item) => (
                  <PlaylistItem
                    key={item.id}
                    title={item.title}
                    artist={item.artist}
                    albumImg={item.albumImg}
                    variant="playlist"
                    onDelete={() => handleRemoveMusic(item.id)}
                    onPlay={() => {
                      setCurrentIndex(playlist.findIndex(p => p.id === item.id));
                      setIsPlaying(true);
                    }}
                  />
                ))}
              </ul>
            ) : (
              <div className="empty">
                <button type="button" onClick={() => setIsSearchOpen(true)}>
                  곡을 추가해 주세요
                </button>
              </div>
            )}
          </div>

          <div className="bottom_btn">
            <button type="button" onClick={() => setIsSearchOpen(true)}>add music</button>
            <button type="button">save list</button>
          </div>
        </section>

        <section className="right">
          <div className="lp_wrap">
            <div className="vinyl">
              <img src="/images/lp.png" alt="lp" />
            </div>
            <div className="cover_img"></div>
          </div>
        </section>
      </div>

      {isSearchOpen && (
        <SearchList
          onClose={() => setIsSearchOpen(false)}
          onSelect={handleAddMusic}
        />
      )}

      {isPlaying && playlist[currentIndex] && (
        <iframe
          width="0"
          height="0"
          style={{ position: 'absolute', left: '-9999px' }}
          src={`https://www.youtube.com/embed/${playlist[currentIndex].videoId}?autoplay=1&enablejsapi=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      )}
    </>
  );
}

export default Home;
