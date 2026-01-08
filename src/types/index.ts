
export type PlaylistItemType = {
    id: number;
    title: string;
    artist: string;
    albumImg: string;
    videoId: string;
  };

  export type SavedListType = {
    id: number;
    title: string;
    date: string;
    items: PlaylistItemType[];
  };
  