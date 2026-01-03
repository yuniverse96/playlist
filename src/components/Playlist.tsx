type Props = {
  title: string;
  artist: string;
  albumImg: string;
  onClick?: () => void;
  variant?: 'search' | 'playlist'; // 버튼 타입
  onAdd?: () => void;
  onDelete?: () => void;
};

function PlaylistItem({
  title,
  artist,
  albumImg,
  onClick,
  variant,
  onAdd,
  onDelete,
}: Props) {
  return (
    <li className="list_box" onClick={onClick}>
      <div className="album_img">
        <img src={albumImg} alt={title} />
      </div>

      <div className="album_info">
        <h3>{title}</h3>
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
