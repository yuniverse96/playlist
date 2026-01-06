import type { PlaylistItemType } from '../types';
import PlaylistItem from './Playlist';

type Props = {
  playlist: PlaylistItemType[];
  onRemove: (id: number) => void;
  onPlay: (id: number) => void;
  onSave: () => void;
  onOpenSearch: () => void;
};

function MainPlaylist({ playlist, onRemove, onPlay, onSave, onOpenSearch }: Props) {
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
            {playlist.map((item) => (
                <PlaylistItem
                key={item.id}
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
        <button type="button" onClick={onSave}>save list</button>
        </div>
      </>
   
      
    
  );
}

export default MainPlaylist;