import { useState } from 'react';
import type {SavedListType, PlaylistItemType } from '../types';


type Props = {
  allSavedLists: SavedListType[];
  onClose: () => void;
  onSelect: (items: PlaylistItemType[]) => void;
  onDeleteList: (id: number) => void;
};

function LoadList({ allSavedLists, onClose, onSelect, onDeleteList }: Props) {
  const [selectedList, setSelectedList] = useState<SavedListType | null>(null);


  return (
    <div id="pop_wrap" className="load_modal">
      <div className="pop_box">
        <div className="card_wrap">
        <div className="result_wrap">
            {/* 저장된 리스트가 아예 없을 때*/}
            {allSavedLists.length === 0 ? (
              <p className="empty">저장된 리스트가 없습니다.</p>
            ) : (
              /*리스트가 존재할 때 (상세보기 vs 목록보기)*/
              <>
                {selectedList ? (
                  /* --- 상세 보기 화면 --- */
                  <div className="detail_wrap">
                    <div className='detail_header'>
                        <button className="back" onClick={() => setSelectedList(null)}></button>
                        <h3>{selectedList.title}</h3>
                        <p className='date'>{selectedList.date || "null"}</p>
                        <button
                          className="apply"
                          onClick={() => onSelect(selectedList.items)}
                        > {selectedList.items.length}곡 재생
                        </button>
                    </div>
                    
                    <ul className="detail_item">
                      {selectedList.items.map((item) => (
                        <li key={item.id} className="list_box">
                          <div className='album_img'>
                            <img src={item.albumImg} alt={item.title} />
                          </div>
                          <div className="album_info">
                            <h3 className="title">{item.title}</h3>
                            <p className="artist">{item.artist}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                   
                  </div>
                ) : (
                  /* --- 리스트 목록 보기 화면 --- */
                  <ul className='save_list'>
                    {allSavedLists.map((list) => (
                      <li 
                        className="save_box"
                        key={list.id} 
                        onClick={() => setSelectedList(list)} //상세로 이동
                      >
                        <div className='list_info'>
                          <div className='top'>
                              <h3 className="list_title">{list.title} - </h3>
                              <span className="list_count">{list.items.length}곡</span>
                          </div>
                          <p className="list_date">{list.date ? list.date : "null"}</p>
                        </div>
                        <button 
                          type="button" 
                          className="del"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteList(list.id);
                          }}
                        >✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          </div>
          
        <button className="close" type="button" onClick={onClose}>
          <img src="/images/close.svg" alt="닫기" />
        </button>
      </div>
    </div>
  );
}

export default LoadList;