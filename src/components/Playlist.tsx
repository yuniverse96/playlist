type Props = {
  title: string;
  artist: string;
  albumImg: string;
  onClick?: () => void;
  variant?: 'search' | 'playlist';
  onAdd?: () => void;
  onDelete?: () => void;
  onPlay?: () => void;
}


function PlaylistItem({
  title,
  artist,
  albumImg,
  onClick,
  variant,
  onAdd,
  onDelete,
  onPlay,
}: Props) {
  return (
    <li className="list_box" onClick={onClick}>
      <div className="album_img">
        <img src={albumImg} alt={title} />
      </div>

      <div className="album_info">
        {variant === 'playlist' ? (
            <h3 onClick={() => onPlay?.()}>{title}</h3>
          ) : (
            <h3>{title}</h3>
        )}
        <p>{artist}</p>
      </div>

      {variant && (
        <button
          type="button"
          className={variant === 'search' ? 'add_btn' : 'delete_btn'}
          onClick={(e) => {
            e.stopPropagation();
            variant === 'search' ? onAdd?.() : onDelete?.();
          }}
        >
          {variant === 'search' ? '+' : '✕'}
        </button>
      )}
    </li>
  );
}

export default PlaylistItem;
