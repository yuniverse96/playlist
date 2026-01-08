import type { PlaylistItemType } from '../types';
import PlaylistItem from './Playlist';

type Props = {
  playlist: PlaylistItemType[];
  currentIndex: number;
  onRemove: (id: number) => void;
  onPlay: (id: number) => void;
  isChanged: boolean; // 변경 여부 추가
  onSave: () => void;
  onLoad: () => void;
  onOpenSearch: () => void;
};

function MainPlaylist({ playlist, currentIndex, onRemove, onPlay, isChanged, onSave, onLoad, onOpenSearch }: Props) {
  const showLoadButton = playlist.length === 0 || !isChanged;


  return (
      <>
        <h2>my playlist</h2>

        <div className="total_info">
        <span>now</span>
        <p>{playlist.length}</p>
        </div>

        <div className="list_wrap">
        {playlist.length > 0 ? (
            <ul>
            {playlist.map((item, index) => (
                <PlaylistItem
                key={item.id}
                isActive={index === currentIndex}
                title={item.title}
                artist={item.artist}
                albumImg={item.albumImg}
                variant="playlist"
                onDelete={() => onRemove(item.id)}
                onPlay={() => onPlay(item.id)}
                />
            ))}
            </ul>
        ) : (
            <div className="empty">
            <button type="button" onClick={onOpenSearch}>
                곡을 추가해 주세요
            </button>
            </div>
        )}
        </div>

        <div className="bottom_btn">
          <button type="button" onClick={onOpenSearch}>add music</button>
          {showLoadButton ? (
              <button type="button" onClick={onLoad}>load list</button>
            ) : (
              <button type="button" onClick={onSave} className="save">save list</button>
          )}
        </div>
      </>
   
      
    
  );
}

export default MainPlaylist;