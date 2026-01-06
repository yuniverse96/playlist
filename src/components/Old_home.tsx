import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import PlaylistItem from '../components/Playlist';
import SearchList from '../pages/SearchList';
import VinylPlayer from '../components/VinylPlayer';
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

  // 곡이 끝났을 때 실행될 함수
  const onPlayerEnd = () => {
    
    if (currentIndex < playlist.length - 1) {
      // 다음 곡으로 인덱스 이동
      setCurrentIndex((prev) => prev + 1);
      // 명시적으로 재생 상태 유지
      setIsPlaying(true); 
    } else {
      // 더 이상 다음 곡이 없으면 멈춤
      setIsPlaying(false);
    }
  };

  // 음악 삭제 기능
  const handleRemoveMusic = (id: number) => {
    //삭제할 곡의 인덱스
    const targetIndex = playlist.findIndex((item) => item.id === id);
    if (targetIndex === -1) return;
  
    //현재 재생 중인 곡을 삭제
    if (currentIndex === targetIndex) {
      if (isPlaying) {
        // 재생 중이면 멈추는 애니메이션을 위해 먼저 정지
        setIsPlaying(false);
        
        setTimeout(() => {
          setPlaylist((prev) => {
            const newList = prev.filter((item) => item.id !== id);
            // 다음 곡이 있으면 그 자리에 멈춤, 없으면 마지막 곡으로 조정
            if (currentIndex >= newList.length) {
              setCurrentIndex(Math.max(0, newList.length - 1));
            }
            return newList;
          });
        }, 1500);
      } else {
        // 재생 중이 아닐 때는 바로 삭제 후 인덱스 조정
        setPlaylist((prev) => {
          const newList = prev.filter((item) => item.id !== id);
          if (currentIndex >= newList.length) {
            setCurrentIndex(Math.max(0, newList.length - 1));
          }
          return newList;
        });
      }
    } 
    //재생 중인 곡보다 앞에 있는 곡을 삭제하는 경우
    else {
      setPlaylist((prev) => {
        if (targetIndex < currentIndex) {
          //앞의 곡이 사라지므로 인덱스 번호를 하나 줄여줘야 현재 곡이 유지
          setCurrentIndex((prevIdx) => prevIdx - 1);
        }
        return prev.filter((item) => item.id !== id);
      });
    }
  };


  //애니메이션 타겟을 잡기 위한 Ref 생성
  const playerRef = useRef<any>(null); // 유튜브 플레이어 인스턴스 저장용


    //재생/정지 감속
    useEffect(() => {
      if (!playerRef.current) return;
  
      if (isPlaying && playlist[currentIndex]) {
        // 900ms 뒤에 음악 재생 (LP바 내려오는 시간 대기)
        const timer = setTimeout(() => {
          if (isPlaying) playerRef.current.playVideo();
        }, 900);
        return () => clearTimeout(timer);
      } else {
        playerRef.current.pauseVideo();
      }
    }, [isPlaying, currentIndex]);
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
        <VinylPlayer 
            isPlaying={isPlaying} 
            currentImg={playlist[currentIndex]?.albumImg} 
            onTogglePlay={() => {
              if (playlist.length > 0) setIsPlaying(!isPlaying);
            }}
         />
        </section>
      </div>

      {isSearchOpen && (
        <SearchList
          onClose={() => setIsSearchOpen(false)}
          onSelect={handleAddMusic}
        />
      )}

      {/* playlist에 곡이 있고, 한 번이라도 재생을 눌렀을 때만 플레이어 생성 */}
      {playlist.length > 0 && playlist[currentIndex] && (
        <div style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
          <YouTube
            videoId={playlist[currentIndex].videoId}
            opts={{
              playerVars: {
                autoplay: 1, 
                enablejsapi: 1,
              },
            }}
            onReady={(event: any) => {
              playerRef.current = event.target;//player 인스턴스 저장
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnd={onPlayerEnd}
          />
        </div>
      )}
    </>
  );
}

export default Home;