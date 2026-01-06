import { useState } from 'react';
import type { PlaylistItemType } from '../types';

export const usePlaylist = () => {
  const [playlist, setPlaylist] = useState<PlaylistItemType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

//   //초기 로드: 로컬스토리지에서 불러오기
//   useEffect(() => {
//     const saved = localStorage.getItem('my-playlist');
//     if (saved) {
//       try {
//         setPlaylist(JSON.parse(saved));
//       } catch (e) {
//         console.error("데이터 파싱 에러", e);
//       }
//     }
//   }, []);

  // 저장 기능
  const handleSaveList = () => {
    alert("현재 플레이리스트 저장 기능은 개발 중입니다! 🚧");
  };

  // 곡 추가
  const handleAddMusic = (item: PlaylistItemType) => {
    setPlaylist((prev) => [...prev, item]);
  };

  // 곡 삭제 기능
  // 음악 삭제 기능
  const handleRemoveMusic = (id: number) => {
    //삭제할 곡의 인덱스
    const targetIndex = playlist.findIndex((item) => item.id === id);
    if (targetIndex === -1) return;
  
    //현재 재생 중인 곡을 삭제
     if (currentIndex === targetIndex) {
      // 삭제 전 재생 상태를 먼저 끄고, 약간의 텀을 둡니다.
      setIsPlaying(false);
      
      // 즉시 인덱스 조정 (데이터가 삭제되기 전에 미리 안전한 곳으로 옮김)
      if (currentIndex >= playlist.length - 1 && playlist.length > 1) {
        setCurrentIndex(playlist.length - 2);
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
    setPlaylist(prev => prev.filter(item => item.id !== id));

  };

  // 재생 종료 시 다음 곡 이동
  const onPlayerEnd = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };


  return {
    playlist,
    currentIndex,
    isPlaying,
    setPlaylist,
    setCurrentIndex,
    setIsPlaying,
    handleAddMusic,
    handleRemoveMusic,
    handleSaveList,
    onPlayerEnd,
  };
};