import { useState } from 'react';
import type { PlaylistItemType } from '../types';

export const usePlaylist = () => {
  const [playlist, setPlaylist] = useState<PlaylistItemType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);//에러 메세지

  //토스트 실행 함수
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1000); 
  };

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
    showToast("현재 플레이리스트 저장 기능은 개발 중입니다! 🚧");
  };

  // 곡 추가
  const handleAddMusic = (item: PlaylistItemType) => {
    setPlaylist((prev) => {
      //이미 같은 videoId가 리스트에 있는지 확인
      const isDuplicate = prev.some((music) => music.videoId === item.videoId);
  
      if (isDuplicate) {
        showToast("이미 추가된 곡입니다! 😊");
        return prev; // 중복이면 상태를 변경하지 않고 이전 리스트 그대로 반환
      }
  
      // 2. 중복이 아닐 경우에만 새 리스트 생성
      const newList = [...prev, item];
      
      // 첫 곡 추가 시 인덱스 0으로 설정
      if (prev.length === 0) {
        setCurrentIndex(0);
      }
      
      return newList;
    });
  };

  // 곡 삭제 기능
  const handleRemoveMusic = (id: number) => {
    setPlaylist((prev) => {
      const targetIndex = prev.findIndex((item) => item.id === id);
      if (targetIndex === -1) return prev;

      const newList = prev.filter((item) => item.id !== id);

      // 삭제될 곡이 현재 재생 중인 곡일 때
      if (currentIndex === targetIndex) {
        setIsPlaying(false); // 일단 멈춤

        // 삭제 후 인덱스 보정: 지운 곡이 마지막 곡이었다면 인덱스를 앞으로 한 칸 당김
        if (currentIndex >= newList.length && newList.length > 0) {
          setCurrentIndex(newList.length - 1);
        }
      } 
      // 삭제될 곡이 현재 재생 중인 곡보다 앞에 있을 때
      else if (targetIndex < currentIndex) {
        setCurrentIndex((prevIdx) => prevIdx - 1);
      }

      return newList;
    });
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
    toastMessage,
    showToast,
    setPlaylist,
    setCurrentIndex,
    setIsPlaying,
    handleAddMusic,
    handleRemoveMusic,
    handleSaveList,
    onPlayerEnd,
  };
};