import { useState, useEffect } from 'react';
import type { SavedListType, PlaylistItemType } from '../types';


export const usePlaylist = () => {

  const [playlist, setPlaylist] = useState<PlaylistItemType[]>([]);
  const [allSavedLists, setAllSavedLists] = useState<SavedListType[]>([]);
  const [lastSavedList, setLastSavedList] = useState<PlaylistItemType[]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);//에러 메세지

  //토스트 실행 함수
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1000); 
  };

  //초기 빈배열 로드
  useEffect(() => {
    const saved = localStorage.getItem('saved-playlists');
    if (saved) {
      setAllSavedLists(JSON.parse(saved));
    }
  }, []);
  
    //리스트 저장: 제목 입력받아 전체 목록에 추가
    const handleSaveList = () => {
        if (playlist.length === 0) return;
        const title = prompt("플레이리스트 제목을 정해주세요! 😊");
        if (!title) return;
        // 현재 날짜 생성 (예: 2024. 3. 21.)
        const currentDate = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        const newList = { 
            id: Date.now(), 
            title, 
            date: currentDate,
            items: [...playlist] 
        };
        const updatedTotal = [...allSavedLists, newList];

        setAllSavedLists(updatedTotal);
        localStorage.setItem('saved-playlists', JSON.stringify(updatedTotal));
        
        // 현재 리스트를 저장점으로 기록 (버튼을 load list로 돌리기 위함)
        setLastSavedList([...playlist]);
        showToast(`'${title}' 저장 완료!`);
    };

    //리스트 삭제
    const deleteSavedList = (id: number) => {
        //유저에게 진짜 삭제할지 물어보기
        if (!confirm("정말 이 리스트를 삭제하시겠습니까?")) return;
    
        //해당 id만 제외하고 필터링
        const updatedTotal = allSavedLists.filter(list => list.id !== id);
    
        //상태 업데이트 및 로컬스토리지 저장
        setAllSavedLists(updatedTotal);
        localStorage.setItem('saved-playlists', JSON.stringify(updatedTotal));
        
        showToast("리스트가 삭제되었습니다.");
    };

    //특정 리스트 불러오기
    const loadSpecificList = (items: PlaylistItemType[]) => {
        setPlaylist(items);            //새로운 리스트로 교체
        setLastSavedList(items);       //저장 시점 동기화
        setCurrentIndex(0);            //인덱스를 첫 번째 곡으로 초기화
        showToast("리스트를 불러왔습니다! 🎵");
    };
  
  //변경 여부 확인 (곡 구성이 같은지 비교)
  const isChanged = JSON.stringify(playlist) !== JSON.stringify(lastSavedList);

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
        setCurrentIndex(0);
        setIsPlaying(true);
    }
  };


  return {
    playlist,
    currentIndex,
    isPlaying,
    toastMessage,
    isChanged,  
    allSavedLists,
    handleSaveList,
    deleteSavedList,
    loadSpecificList,
    showToast,
    setPlaylist,
    setCurrentIndex,
    setIsPlaying,
    handleAddMusic,
    handleRemoveMusic,
    onPlayerEnd,
  };
};