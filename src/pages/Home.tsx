import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import SearchList from './SearchList';
import LoadList from '../components/LoadList';
import MainPlaylist from '../components/MainPlaylist';
import VinylPlayer from '../components/VinylPlayer';
import { usePlaylist } from '../hooks/usePlaylist';


function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  
  //Custom Hook 사용
  const {
    playlist,
    currentIndex,
    isPlaying,
    isChanged,
    toastMessage,
    allSavedLists,
    deleteSavedList,
    loadSpecificList,
    showToast,
    setCurrentIndex,
    setIsPlaying,
    handleAddMusic,
    handleRemoveMusic,
    handleSaveList,
    onPlayerEnd,
  } = usePlaylist();

  const playerRef = useRef<any>(null);


useEffect(() => {
  //플레이어 인스턴스가 없으면 아무것도 하지 않음
  if (!playerRef.current) return;

  //현재 곡 데이터가 존재확인
  const currentVideo = playlist[currentIndex];

  if (isPlaying && currentVideo) {
    // 재생 로직
    const timer = setTimeout(() => {
      if (isPlaying && playerRef.current) {
        playerRef.current.playVideo();
      }
    }, 900);
    return () => clearTimeout(timer);
  } else {
    //일시정지 -> 플레이어의 상태를 체크
    //try-catch로 감싸서 유튜브 API 내부 에러가 리액트 앱을 멈추지 않게 방어
    try {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.warn("유튜브 플레이어 제어 중 일시적인 오류 발생:", error);
    }
  }
}, [isPlaying, currentIndex, playlist]);

  return (
    <>
      <div id="main">
        <section className="left">
          <MainPlaylist 
          playlist={playlist}
          onRemove={handleRemoveMusic}
          isChanged={isChanged}
          currentIndex={currentIndex}
          onSave={handleSaveList}
          onLoad={() => setIsLoadModalOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onPlay={(id) => {
            const index = playlist.findIndex(p => p.id === id);
            setCurrentIndex(index);
            setIsPlaying(true);
          }} />
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
          onError={showToast}
        />
      )}

      {isLoadModalOpen && (
        <LoadList
          allSavedLists={allSavedLists}
          onClose={() => setIsLoadModalOpen(false)}
          onSelect={(items) => {
            loadSpecificList(items);
            setIsLoadModalOpen(false);
          }}
          onDeleteList={deleteSavedList}
        />
      )}

      {toastMessage && (
        <div id="toast_pop">
          <div className="toast_message">
            {toastMessage}
          </div>
        </div>
      )}
      {/* playlist에 곡이 있고, 한 번이라도 재생을 눌렀을 때만 플레이어 생성 */}
      {playlist.length > 0 && playlist[currentIndex] && (
        <div style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
          <YouTube
            key={playlist[currentIndex].id}
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
