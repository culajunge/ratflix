import { MediaResult, SearchResult, Season, TvShowDetails } from '../types/MediaTypes.ts';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

//vidsrc
const domainSuffix1 = "xyz";
const MOVIE_BASE_URL_1 = `https://vidsrc.${domainSuffix1}/embed/movie?tmdb=`;
const TV_BASE_URL_1 = `https://vidsrc.${domainSuffix1}/embed/tv?tmdb=`;


export class MovieDbService {

    public static readonly vidProviders = [
        {
            name: "vidsrc",
        },
        {
            name: "superembed",
        },
        {
            name: "nontogo"
        },
        {
            name: "autoembed"
        }
    ];

    public static currentVidProviderIndex = parseInt(localStorage.getItem('vidProviderIndex') || '0');


    static async searchMulti(query: string, looseSearch = true): Promise<SearchResult> {
        const params = new URLSearchParams({
            api_key: API_KEY,
            query,
            include_adult: 'false',
            search_distance: '2',
            min_score: '0.1'
        });

        const response = await fetch(`${BASE_URL}/search/multi?${params}`);
        return await response.json();
    }

    static async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<SearchResult> {
        const response = await fetch(`${BASE_URL}/trending/all/${timeWindow}?api_key=${API_KEY}`);
        return await response.json();
    }

    static async getImdbId(tmdbId: string, mediaType: 'movie' | 'tv'): Promise<string> {
        const params = new URLSearchParams({
            api_key: API_KEY
        });

        const response = await fetch(`${BASE_URL}/${mediaType}/${tmdbId}/external_ids?${params}`);
        const data = await response.json();
        return data.imdb_id;
    }

    static async getSeasonDetails(tvShowId: number, seasonNumber: number): Promise<Season> {
        const response = await fetch(`${BASE_URL}/tv/${tvShowId}/season/${seasonNumber}?api_key=${API_KEY}`);
        return await response.json();
    }


    static async getEpisodeUrl(showId: number, seasonNumber: number, episodeNumber: number): Promise<string> {
        switch(this.currentVidProviderIndex){
            case 0:
                return `${TV_BASE_URL_1}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;

            case 1:
                return `${this.getVideoUrl2(showId.toString())}&season=${seasonNumber}&episode=${episodeNumber}`;

            case 2:
                return await this.getTvShowUrl3(showId.toString(), seasonNumber, episodeNumber);

            case 3:
                return this.getTvShowUrl4(showId.toString(), seasonNumber, episodeNumber);

            default:
                return `${TV_BASE_URL_1}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;
        }
    }

    static async getMovieUrl(movieId: string): Promise<string> {
        switch(this.currentVidProviderIndex) {
            case 0:
                return `${MOVIE_BASE_URL_1}${movieId}`;

            case 1:
                return `${this.getVideoUrl2(movieId)}`;

            case 2:
                return this.getMovieUrl3(movieId);

            case 3:
                return this.getMovieUrl4(movieId);

            default:
                return `${MOVIE_BASE_URL_1}${movieId}`;
        }

    }

    //multiembed

    static getVideoUrl2(movieId: string): string {
        const MOVIE_BASE_URL_2 = `https://multiembed.mov/?video_id=${movieId}&tmdb=1`;
        return MOVIE_BASE_URL_2;
    }

    //Nontongo

    static async getMovieUrl3(movieId: string): Promise<string> {
        var imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_3 = `https://www.NontonGo.win/embed/movie/${imdbid}`;
        return MOVIE_BASE_URL_3;
    }

    static async getTvShowUrl3(showId:string, season:number, episode:number):Promise<string>{
        var imdbid = await this.getImdbId(showId, 'tv');
        const TV_BASE_URL_3 = `https://www.NontonGo.win/embed/tv/${imdbid}/${season.toString()}/${episode.toString()}`;
        return TV_BASE_URL_3;
    }

    //autoembed

    static getMovieUrl4(movieId: string): string {
        const MOVIE_BASE_URL_4 = `https://player.autoembed.cc/embed/movie/${movieId}`;
        return MOVIE_BASE_URL_4;
    }

    static getTvShowUrl4(showId: string, season: number, episode: number): string {
        const TV_BASE_URL_4 = `https://player.autoembed.cc/embed/tv/${showId}/${season}/${episode}`;
        return TV_BASE_URL_4;
    }


}