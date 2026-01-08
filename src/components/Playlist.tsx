type Props = {
  title: string;
  artist: string;
  albumImg: string;
  onClick?: () => void;
  variant?: 'search' | 'playlist';
  onAdd?: () => void;
  onDelete?: () => void;
  onPlay?: () => void;
  isActive?: boolean;
}


function PlaylistItem({ title, artist, albumImg, isActive, variant, onAdd, onDelete, onPlay }: Props) {
  // 아이템 클릭 시 작동 (플레이리스트 => 재생, 검색 모드 => x)
  const handleItemClick = () => {
    if (variant === 'playlist') {
      onPlay?.();
    }
  };

  return (
    <li className={`list_box ${variant} ${isActive ? 'now' : ''}`} onClick={handleItemClick}>
      <div className="album_img">
        <img src={albumImg} alt={title} />
      </div>

      <div className="album_info">
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>

      {variant === 'search' && (
        <button className="add_btn" type="button" onClick={(e) => { e.stopPropagation(); onAdd?.(); }}>
          +
        </button>
      )}

      {variant === 'playlist' && (
        <button className="delete_btn" type="button" onClick={(e) => { e.stopPropagation(); onDelete?.(); }}>
          ✕
        </button>
      )}
    </li>
  );
}

export default PlaylistItem;
