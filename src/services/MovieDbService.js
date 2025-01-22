const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const domainSuffix = "xyz";
const MOVIE_BASE_URL = `https://vidsrc.${domainSuffix}/embed/movie?tmdb=`;
const TV_BASE_URL = `https://vidsrc.${domainSuffix}/embed/tv?tmdb=`;
export class MovieDbService {
    static async searchMulti(query, looseSearch = true) {
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
    static async getTrending(timeWindow = 'week') {
        const response = await fetch(`${BASE_URL}/trending/all/${timeWindow}?api_key=${API_KEY}`);
        return await response.json();
    }
    static async getSeasonDetails(tvShowId, seasonNumber) {
        const response = await fetch(`${BASE_URL}/tv/${tvShowId}/season/${seasonNumber}?api_key=${API_KEY}`);
        return await response.json();
    }
    static getEpisodeUrl(showId, seasonNumber, episodeNumber) {
        return `${TV_BASE_URL}${showId}&season=${seasonNumber}&episode=${episodeNumber}`;
    }
    static getMovieUrl(movieId) {
        return `${MOVIE_BASE_URL}${movieId}`;
    }
}
