import {MediaResult, Season} from './MediaTypes.ts';
import {WatchProgress} from './WatchHistory.ts';

export interface GuiState {
    mode: 'home' | 'search' | 'media' | 'season';
    searchResults: MediaResult[];
    currentMedia: MediaResult | null;
    currentSeason: Season | null;
    currentEpisodeIndex: number;
    watchHistory: WatchProgress[];
}