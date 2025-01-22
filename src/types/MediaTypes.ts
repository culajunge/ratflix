export interface TvShowDetails {
    number_of_seasons: number;
    name: string;
    overview: string;
    first_air_date: string;
    last_air_date: string;
    status: string;
    seasons: Season[];
}

export interface Season {
    season_number: number;
    episodes: Episode[];
}

export interface Episode {
    episode_number: number;
    name: string;
    id: number;
}

export interface SearchResult {
    page: number;
    results: MediaResult[];
    total_results: number;
    total_pages: number;
}

export interface MediaResult {
    id: number;
    media_type: string;
    title?: string;
    release_date?: string;
    name?: string;
    first_air_date?: string;
    overview: string;
    vote_average: number;
}
