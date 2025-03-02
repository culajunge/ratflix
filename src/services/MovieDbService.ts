import { MediaResult, SearchResult, Season, TvShowDetails } from '../types/MediaTypes.ts';
import {ConsoleStore} from "../store/consoleStore.ts";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

//vidsrc
const domainSuffix1 = "xyz";
const MOVIE_BASE_URL_1 = `https://vidsrc.${domainSuffix1}/embed/movie?tmdb=`;
const TV_BASE_URL_1 = `https://vidsrc.${domainSuffix1}/embed/tv?tmdb=`;

export class MovieDbService {

    public static readonly vidProviders = [
        {
            name: "vidsrc (stable)",
        },
        {
            name: "superembed",
        },
        {
            name: "nontogo (high quality)"
        },
        {
            name: "autoembed"
        },
        {
            name: "vidsrc.me"
        },
        {
            name: "fsapi.xyz (unreliable)"
        },
        {
            name: "curtstream (unreliable)"
        },
        {
            name: "moviewp (unreliable)"
        },
        {
            name: "apimdb (is no more)"
        },
        {
            name: "gomo.to"
        },
        {
            name: "vidcloud"
        },
        {
            name: "getsuperembed"
        },
        {
            name: "databasegdriveplayer"
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

    static getBackGroundColor(): string{
        const consoleapp = ConsoleStore.getConsoleApp();
        const settings = consoleapp?.loadSettings();
        const color = settings!['--background-color'].replace('#', '');
        return color;
    }


    static async getEpisodeUrl(showId: number, seasonNumber: number, episodeNumber: number): Promise<string> {
        console.log("currentVidProviderIndex: ", this.currentVidProviderIndex);
        switch (this.currentVidProviderIndex) {
            case 0:
                return this.getTvShowUrl1(showId.toString(), seasonNumber, episodeNumber, false);
            case 1:
                return `${this.getVideoUrl2(showId.toString())}&season=${seasonNumber}&episode=${episodeNumber}`;
            case 2:
                return await this.getTvShowUrl3(showId.toString(), seasonNumber, episodeNumber);
            case 3:
                return this.getTvShowUrl4(showId.toString(), seasonNumber, episodeNumber);
            case 4:
                // vidsrc.me (movies only) - does not support TV shows
                return `${TV_BASE_URL_1}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;
            case 5:
                return this.getTvShowUrlFsapi(showId.toString(), seasonNumber, episodeNumber);
            case 6:
                return this.getTvShowUrlCurtstream(showId.toString(), seasonNumber, episodeNumber);
            case 7:
                return this.getTvShowUrlMoviewp(showId.toString(), seasonNumber, episodeNumber);
            case 8:
                return this.getTvShowUrlApimdb(showId.toString(), seasonNumber, episodeNumber);
            case 9:
                // gomo.to (movies only) - does not support TV shows
                return `${TV_BASE_URL_1}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;
            case 10:
                // vidcloud (movies only) - does not support TV shows
                return `${TV_BASE_URL_1}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;
            case 11:
                return this.getTvShowUrlGetsuperembed(showId.toString(), seasonNumber, episodeNumber);
            case 12:
                return this.getTvShowUrlDatabasegdriveplayer(showId.toString(), seasonNumber, episodeNumber);
            default:
                return `${TV_BASE_URL_1}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;
        }
    }

    static async getMovieUrl(movieId: string): Promise<string> {
        console.log("currentVidProviderIndex: ", this.currentVidProviderIndex);
        switch (this.currentVidProviderIndex) {
            case 0:
                return this.getMovieUrl1(movieId, false);
            case 1:
                return this.getVideoUrl2(movieId);
            case 2:
                return this.getMovieUrl3(movieId);
            case 3:
                return this.getMovieUrl4(movieId);
            case 4:
                return this.getMovieUrlVidsrcMe(movieId);
            case 5:
                return this.getMovieUrlFsapi(movieId);
            case 6:
                return this.getMovieUrlCurtstream(movieId);
            case 7:
                return this.getMovieUrlMoviewp(movieId);
            case 8:
                return this.getMovieUrlApimdb(movieId);
            case 9:
                return this.getMovieUrlGomo(movieId);
            case 10:
                return this.getMovieUrlVidcloud(movieId);
            case 11:
                return this.getMovieUrlGetsuperembed(movieId);
            case 12:
                return 'https://hackertyper.net/';
            default:
                return `${MOVIE_BASE_URL_1}${movieId}`;
        }
    }

    //vidsrc
    static async getMovieUrl1(movieId: string, autoplay: boolean): Promise<string> {
        let url = `${MOVIE_BASE_URL_1}${movieId}`;
        if(autoplay) {
            //Not working
            url += '&autoplay=1';
        }
        return url;
    }

    static async getTvShowUrl1(showId: string, season: number, episode: number, autoplay: boolean): Promise<string> {
        let url = `${TV_BASE_URL_1}${showId}&season=${season}&episode=${episode}`;
        if(autoplay){
            // Not working
            url += '&autoplay=1';
        }
        return url;
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

    // vidsrc.me (movies only)
    static async getMovieUrlVidsrcMe(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_5 = `https://vidsrc.me/embed/${imdbid}/`;
        return MOVIE_BASE_URL_5;
    }

    // fsapi.xyz
    static async getMovieUrlFsapi(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_6 = `https://fsapi.xyz/movie/${imdbid}`;
        return MOVIE_BASE_URL_6;
    }

    static async getTvShowUrlFsapi(showId: string, season: number, episode: number): Promise<string> {
        const imdbid = await this.getImdbId(showId, 'tv');
        const TV_BASE_URL_6 = `https://fsapi.xyz/tv-imdb/${imdbid}-${season}-${episode}`;
        return TV_BASE_URL_6;
    }

    // curtstream
    static async getMovieUrlCurtstream(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_7 = `https://curtstream.com/movies/imdb/${imdbid}`;
        return MOVIE_BASE_URL_7;
    }

    static async getTvShowUrlCurtstream(showId: string, season: number, episode: number): Promise<string> {
        const TV_BASE_URL_7 = `https://curtstream.com/series/tmdb/${showId}/${season}/${episode}/`;
        return TV_BASE_URL_7;
    }

    // moviewp
    static async getMovieUrlMoviewp(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_8 = `https://moviewp.com/se.php?video_id=${imdbid}`;
        return MOVIE_BASE_URL_8;
    }

    static async getTvShowUrlMoviewp(showId: string, season: number, episode: number): Promise<string> {
        const TV_BASE_URL_8 = `https://moviewp.com/se.php?video_id=${showId}&tmdb=1&s=${season}&e=${episode}`;
        return TV_BASE_URL_8;
    }

    // apimdb
    static async getMovieUrlApimdb(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_9 = `https://v2.apimdb.net/e/movie/${imdbid}`;
        return MOVIE_BASE_URL_9;
    }

    static async getTvShowUrlApimdb(showId: string, season: number, episode: number): Promise<string> {
        const TV_BASE_URL_9 = `https://v2.apimdb.net/e/tmdb/tv/${showId}/${season}/${episode}/`;
        return TV_BASE_URL_9;
    }

    // gomo.to (movies only)
    static async getMovieUrlGomo(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_10 = `https://gomo.to/movie/${imdbid}`;
        return MOVIE_BASE_URL_10;
    }

    // vidcloud (movies only)
    static async getMovieUrlVidcloud(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_11 = `https://vidcloud.stream/${imdbid}.html`;
        return MOVIE_BASE_URL_11;
    }

    // getsuperembed
    static async getMovieUrlGetsuperembed(movieId: string): Promise<string> {
        const imdbid = await this.getImdbId(movieId, 'movie');
        const MOVIE_BASE_URL_12 = `https://getsuperembed.link/?video_id=${imdbid}`;
        return MOVIE_BASE_URL_12;
    }

    static async getTvShowUrlGetsuperembed(showId: string, season: number, episode: number): Promise<string> {
        const imdbid = await this.getImdbId(showId, 'tv');
        const TV_BASE_URL_12 = `https://getsuperembed.link/?video_id=${imdbid}&season=${season}&episode=${episode}`;
        return TV_BASE_URL_12;
    }

    // databasegdriveplayer
    static async getTvShowUrlDatabasegdriveplayer(showId: string, season: number, episode: number): Promise<string> {
        const TV_BASE_URL_13 = `https://databasegdriveplayer.co/player.php?type=series&tmdb=${showId}&season=${season}&episode=${episode}`;
        return TV_BASE_URL_13;
    }

}