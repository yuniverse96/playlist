import { useState,useRef } from 'react';
import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

  // 곡이 끝났을 때 실행될 함수
  const onPlayerEnd = () => {
    console.log("곡이 종료되었습니다.");
    
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
    // 만약 삭제하려는 곡이 현재 재생 중인 곡이라면
    if (playlist[currentIndex]?.id === id && isPlaying) {
      // 1. 먼저 재생 상태를 꺼서 '서서히 멈추는 애니메이션'이 트리거되게 함
      setIsPlaying(false);
  
      //애니메이션이 어느 정도 멈출 시간을 준 뒤 리스트에서 삭제
      setTimeout(() => {
        setPlaylist((prev) => prev.filter((item) => item.id !== id));
      }, 1500); // 감속 duration과 비슷하게 맞춤
    } else {
      // 재생 중이 아닌 곡은 그냥 바로 삭제
      setPlaylist((prev) => prev.filter((item) => item.id !== id));
    }
  };


  //애니메이션 타겟을 잡기 위한 Ref 생성
  const lpRef = useRef<HTMLDivElement>(null);
  const lpBarRef = useRef<HTMLImageElement>(null);
  const playerRef = useRef<any>(null); // 유튜브 플레이어 인스턴스 저장용
  const animation = useRef<gsap.core.Tween>();
    // 메인 애니메이션 생성 (최초 1회)
    useGSAP(() => {
      animation.current = gsap.to(lpRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
        paused: false, // 처음부터 실행 상태로 두되
      }).timeScale(0); // 속도를 0으로 시작
    }, { scope: lpRef });

    //재생/정지 감속
    useGSAP(() => {
      if (isPlaying && playlist[currentIndex]) {
        //LP판 회전 속도 올리기
        animation.current?.play();
        gsap.to(animation.current, { timeScale: 1, duration: 1.5, ease: "power1.in" });
    
        //LP 바 내려오기
        gsap.to(lpBarRef.current, { rotation: -20, duration: 1, ease: "power2.out" });
      
        //유튜브 플레이어 바가 거의 내려왔을 때 재생
        const timer = setTimeout(() => {
          if (playerRef.current && isPlaying) { //중복 클릭시 isPlaying 체크
            playerRef.current.playVideo();
          }
        }, 900);


      } else {
        //LP판 회전 속도 줄이기
        gsap.to(animation.current, { timeScale: 0, duration: 2, ease: "power1.out" });
    
        //LP 바 다시 올라가기
        gsap.to(lpBarRef.current, { rotation: 0, duration: 1, ease: "power2.inOut" });
      //유튜브 플레이어 일시정지
        if (playerRef.current) {
          playerRef.current.pauseVideo();
        }
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
          <div className="lp_bar" 
                ref={lpBarRef} 
                onClick={() => {
                if (playlist.length > 0) setIsPlaying(!isPlaying);
              }}>
            <img src="/images/lp_bar.png" alt="lp_bar" />
          </div>
          <div className="lp_wrap" ref={lpRef}>
            <div className="vinyl">
              <img src="/images/lp.png" alt="lp" />
            </div>
            <div 
              className="cover_img" 
              style={{ 
                backgroundImage: playlist[currentIndex] ? `url(${playlist[currentIndex].albumImg})` : 'none',
              }}
            ></div>
          </div>
        </section>
      </div>

      {isSearchOpen && (
        <SearchList
          onClose={() => setIsSearchOpen(false)}
          onSelect={handleAddMusic}
        />
      )}

      {/* playlist에 곡이 있고, 한 번이라도 재생을 눌렀을 때만 플레이어 생성 */}
      {playlist[currentIndex] && (
        <div style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
          <YouTube
            videoId={playlist[currentIndex].videoId}
            opts={{
              playerVars: {
                autoplay: 1, 
                enablejsapi: 1,
              },
            }}
            onReady={(event) => {
              playerRef.current = event.target; // 플레이어 인스턴스 저장
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
