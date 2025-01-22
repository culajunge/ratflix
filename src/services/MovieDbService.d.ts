import { SearchResult, Season } from '../types/MediaTypes';
export declare class MovieDbService {
    static searchMulti(query: string, looseSearch?: boolean): Promise<SearchResult>;
    static getTrending(timeWindow?: 'day' | 'week'): Promise<SearchResult>;
    static getSeasonDetails(tvShowId: number, seasonNumber: number): Promise<Season>;
    static getEpisodeUrl(showId: number, seasonNumber: number, episodeNumber: number): string;
    static getMovieUrl(movieId: number): string;
}
