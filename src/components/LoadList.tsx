import type {SavedListType, PlaylistItemType } from '../types';


type Props = {
  allSavedLists: SavedListType[];
  onClose: () => void;
  onSelect: (items: PlaylistItemType[]) => void;
};

function LoadList({ allSavedLists, onClose, onSelect }: Props) {
  return (
    <div id="pop_wrap" className="load_modal">
      <div className="pop_box">
        <div className="card_wrap">
          <div className="result_wrap">
            {allSavedLists.length > 0 ? (
              <ul className='save_list'>
                {allSavedLists.map((list) => (
                  <li 
                    className="save_box"
                    key={list.id} 
                    onClick={() => onSelect(list.items)}
                  >
                    <div className='top'>
                        <h3 className="list_title">{list.title} - </h3>
                        <span className="list_count">{list.items.length}곡</span>
                    </div>
                    <p className="list_date">{list.date ? list.date : "null"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">저장된 리스트가 없습니다.</p>
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