import { MovieDbService } from './MovieDbService.ts';
import { MediaResult, SearchResult, Season, TvShowDetails } from '../types/MediaTypes.ts';

export class ConsoleApp {

    private hasInitialized = false;

    public initialize(): void {
        if (this.hasInitialized) return;
        this.hasInitialized = true;
        this.printLogo();
        this.handleOutput('Welcome to ratflix: ' + import.meta.env.VITE_TMDB_API_KEY);
    }

    private currentPath: string = '';
    private currentSearchResult: SearchResult | null = null;
    private currentMediaResult: MediaResult | null = null;
    private currentMediaIndex: number = -1;
    private currentSeason: Season | null = null;
    private currentSeasonIndex: number = -1;
    private currentEpisodeIndex: number = -1;

    API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    BASE_URL = "https://api.themoviedb.org/3";
    domainSuffix = "xyz";
    MOVIE_BASE_URL = `https://vidsrc.${this.domainSuffix}/embed/movie?tmdb=`;
    TV_BASE_URL = `https://vidsrc.${this.MOVIE_BASE_URL}/embed/tv?tmdb=`;

    constructor(private handleOutput: (text: string) => void) {}



    public async handleCommand(input: string): Promise<void> {

        const trimmedInput = input.trim().toLowerCase();

        if (!trimmedInput || trimmedInput === 'exit') return;

        if (trimmedInput === 'help' || trimmedInput === 'h') {
            this.displayHelp();
            return;
        }

        const [command, ...args] = trimmedInput.split(' ');
        const argument = args.join(' ');

        try {
            switch (command) {
                case 'f':
                case 'find':
                    if (argument) {
                        const searchResult = await MovieDbService.searchMulti(argument);
                        this.currentSearchResult = searchResult;

                        this.DisplaySearchResult();
                    } else {
                        this.handleOutput("Usage: f <search term>");
                    }
                    break;

                case 'cd':
                    if (argument) {
                        await this.selectMedia(argument);
                    } else {
                        this.toRoot();
                    }
                    break;

                case 'pwd':
                    this.handleOutput(this.currentPath);
                    break;

                case 'p':
                case 'play':
                    await this.playMedia(argument);
                    break;

                case 'ls':
                case 'list':
                case 'ep':
                    await this.listItems();
                    break;

                case 'n':
                case 'next':
                    this.playNextEpisode();
                    break;

                case 'c':
                case 'clear':
                    this.clearConsole();
                    break;

                case 'd':
                case 'download':
                    await this.downloadMedia(argument);
                    break;

                default:
                    this.handleOutput("Unknown command. Type 'help' for available commands.");
                    break;
            }

            if(command === "c" || command === "clear") {
               return;
            }
            this.handleOutput('\n');
        } catch (error) {
            this.handleOutput("An error occurred: " + error.message);
        }

    }

    public printLogo(): void {
        this.handleOutput('<span style="color: #e74856;", "fontweight: bold">ratflix</span>');
    }

    public getCurrentPath(): string {
        return this.currentPath;
    }

    private DisplaySearchResult(): void{

        if(this.currentSearchResult!.results.length <= 0){
            this.handleOutput("No results found.");
            return;
        }

        this.currentSearchResult!.results.forEach((result, index) => {
            this.handleOutput(`${index + 1}. ${result.title ?? result.name} (${result.media_type})`);
        });
    }

    private displayHelp(): void {
        const helpText = [
            "\nAvailable commands:",
            "------------------",
            "f <search term>  - Find movies and TV shows",
            "cd <index>       - Change directory to a media item",
            "ls               - List items in the current directory",
            "p                - Play movie",
            "p <index>        - Play episode",
            "clear           - Clear the console",
            "pwd             - Print the current path",
            "help | h        - Display this help message",
            "exit            - Exit the application"
        ];

        helpText.forEach(line => this.handleOutput(line));
    }

    private toRoot(): void {
        this.currentPath = "";
        this.currentMediaIndex = -1;
        this.currentSeason = null;
        this.currentSeasonIndex = -1;
        this.currentMediaResult = null;
        this.currentSearchResult = null;
    }

    private async selectMedia(argument: string): Promise<void> {

        try {
            if (argument === "..") {
                if (this.currentSeason !== null) {
                    this.currentSeasonIndex = -1;
                    this.currentSeason = null;
                    this.currentPath = this.currentMediaResult?.title ?? this.currentMediaResult?.name ?? "";
                } else {
                    this.currentMediaIndex = -1;
                    this.currentMediaResult = null;
                    this.currentPath = "";
                }
                return;
            }

            const parts = argument.split('/');

            switch (parts.length) {
                case 1: // cd Breaking Bad or cd 1
                    if (this.currentSearchResult === null) {
                        const searchResult = await MovieDbService.searchMulti(parts[0], true);
                        this.currentSearchResult = searchResult;
                        parts[0] = "1";
                    }

                    if (this.currentSeason !== null) {
                        this.handleOutput("You are currently in a season. Use 'cd ..' to go back to the parent directory.");
                        return;
                    }

                    // cd into season if in show
                    if (this.currentMediaResult !== null) {
                        const seasonIndex = parseInt(parts[0]);
                        if (!isNaN(seasonIndex)) {
                            this.currentSeasonIndex = seasonIndex;
                            this.currentPath += `/Season ${this.currentSeasonIndex}`;
                            this.currentSeason = await MovieDbService.getSeasonDetails(this.currentMediaResult.id, this.currentSeasonIndex);
                        } else {
                            this.handleOutput("Invalid season index: cd <season index>");
                        }
                        return;
                    }

                    // cd into media result
                    await this.selectByNameOrIndex(parts[0]);
                    break;

                case 2: // cd Breaking Bad/2
                    if (this.currentSearchResult === null) {
                        const searchResult = await MovieDbService.searchMulti(parts[0], true);
                        this.currentSearchResult = searchResult;
                        if (this.currentSearchResult?.results?.length > 0) {
                            this.currentMediaResult = this.currentSearchResult.results[0];
                            this.currentPath = this.currentMediaResult.title ?? this.currentMediaResult.name ?? "";

                            const seasonIndex = parseInt(parts[1]);
                            if (!isNaN(seasonIndex)) {
                                this.currentSeasonIndex = seasonIndex;
                                this.currentPath += `/Season ${this.currentSeasonIndex}`;
                                this.currentSeason = await MovieDbService.getSeasonDetails(this.currentMediaResult.id, this.currentSeasonIndex);
                            }
                        }
                    }
                    break;

                case 3: // cd Breaking Bad/2/13
                    await this.playMedia(`${parts[0]}/${parts[1]}/${parts[2]}`);
                    break;
            }
        } catch (error) {
            this.handleOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }

    }

    private async selectByNameOrIndex(argument: string): Promise<void> {

        try {
            let success = false;
            const index = parseInt(argument);

            if (!isNaN(index)) {
                this.currentMediaIndex = index - 1;
                this.currentMediaResult = this.currentSearchResult!.results[index - 1];
                this.currentPath = this.currentMediaResult.title ?? this.currentMediaResult.name ?? "";
                success = true;
            } else {
                let index2 = 1;
                for (const result of this.currentSearchResult!.results) {
                    if (this.stripDownArg(result.title ?? result.name ?? "") === this.stripDownArg(argument)) {
                        this.currentMediaResult = result;
                        this.currentPath = this.currentMediaResult.title ?? this.currentMediaResult.name ?? "";
                        this.currentMediaIndex = index2;
                        success = true;
                    }
                    index2++;
                }
            }

            if (!success) {
                this.handleOutput("Usage: cd <index>");
            }
        } catch (error) {
            this.handleOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }


    }

    private stripDownArg(query: string): string {
        // Convert to lowercase
        query = query.toLowerCase();

        // Remove extra spaces
        query = query.split(' ').filter(Boolean).join(' ');

        // Remove special characters
        query = query.replace(/[^\w\s]/g, '');

        return query;
    }

    private async listItems(): Promise<void> {

        try {
            if (this.currentMediaResult === null) {
                const trendingResults = await MovieDbService.getTrending();
                this.currentSearchResult = trendingResults;

                this.DisplaySearchResult();
                return;
            } else if (this.currentMediaResult.media_type !== "tv") {
                this.handleOutput("Error: Selected media is not a TV show.");
                return;
            }

            // Check if we're in a season
            if (this.currentSeason !== null) {
                this.currentSeason.episodes.forEach(episode => {
                    this.handleOutput(`Episode ${episode.episode_number}: ${episode.name}`);
                });
            } else {
                // List all seasons
                const response = await fetch(`${this.BASE_URL}/tv/${this.currentMediaResult.id}?api_key=${this.API_KEY}`);
                const showDetails: TvShowDetails = await response.json();

                for (let i = 1; i <= showDetails.number_of_seasons; i++) {
                    this.handleOutput(`${i}. Season ${i}`);
                }
            }
        } catch (error) {
            this.handleOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }


    }

    private async playMedia(argument: string = ""): Promise<void> {

        try {
            // If no argument provided, try to play current media
            if (!argument) {
                if (this.currentMediaResult === null) {
                    this.handleOutput("No media selected... Use 'f' to search for media.");
                    return;
                }

                if (this.currentMediaResult.media_type === "movie") {
                    this.playMovie(this.currentMediaResult.id.toString());
                    return;
                }

                if (this.currentMediaResult.media_type === "tv") {
                    this.playEpisode(MovieDbService.getEpisodeUrl(this.currentMediaResult.id, 1, 1));
                    return;
                }
            }

            // Parse the path-style argument
            const parts = argument.split('/');

            // Handle different path formats
            switch (parts.length) {
                case 1: // p {episode number or movie/show name}
                    const num = parseInt(parts[0]);

                    // If we're in a season and got a number, play that episode
                    if (!isNaN(num) && this.currentSeason) {
                        this.playEpisode(MovieDbService.getEpisodeUrl(
                            this.currentMediaResult!.id,
                            this.currentSeason.season_number,
                            num
                        ));
                        this.currentEpisodeIndex = num;
                        break;
                    }

                    // Otherwise handle search results selection
                    if (!isNaN(num) && this.currentSearchResult) {
                        const media = this.currentSearchResult.results[num - 1];
                        if (media.media_type === "movie") {
                            this.playMovie(media.id.toString());
                        } else if (media.media_type === "tv") {
                            this.playEpisode(MovieDbService.getEpisodeUrl(media.id, 1, 1));
                            this.currentMediaResult = media;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.id, 1);
                            this.currentEpisodeIndex = 1;
                            this.currentPath = `${media.name}/Season 1`;
                        }
                        break;
                    }

                    // Handle search by name
                    // Handle search by name
                    const searchResult2 = await MovieDbService.searchMulti(parts[0], true);
                    this.currentSearchResult = searchResult2;

                    if (this.currentSearchResult?.results?.length > 0) {
                        const media = this.currentSearchResult.results[0];
                        if (media.media_type === "movie") {
                            this.playMovie(media.id.toString());
                        } else if (media.media_type === "tv") {
                            this.playEpisode(MovieDbService.getEpisodeUrl(media.id, 1, 1));
                            this.currentMediaResult = media;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.id, 1);
                            this.currentEpisodeIndex = 1;
                            this.currentPath = `${media.name}/Season 1`;
                        }
                    }

                    break;

                case 2: // p {show}/{season}
                    if (this.currentMediaResult?.media_type === "tv") {
                        // Already in a show context
                        const seasonNum = parseInt(parts[0]);
                        const epNum = parseInt(parts[1]);
                        if (!isNaN(seasonNum) && !isNaN(epNum)) {
                            this.currentSeason = await MovieDbService.getSeasonDetails(this.currentMediaResult.id, seasonNum);
                            this.playEpisode(MovieDbService.getEpisodeUrl(this.currentMediaResult.id, seasonNum, epNum));
                            this.currentEpisodeIndex = epNum;
                            this.currentPath = `${this.currentMediaResult.name}/Season ${seasonNum}`;
                        }
                    } else {
                        // Need to search for the show first
                        const searchResult = await MovieDbService.searchMulti(parts[0], true);
                        this.currentSearchResult = searchResult;
                        if (this.currentSearchResult?.results?.length > 0) {
                            const show = this.currentSearchResult.results[0];
                            const seasonNum = parseInt(parts[1]);
                            if (show.media_type === "tv" && !isNaN(seasonNum)) {
                                this.currentMediaResult = show;
                                this.currentSeason = await MovieDbService.getSeasonDetails(show.id, seasonNum);
                                this.playEpisode(MovieDbService.getEpisodeUrl(show.id, seasonNum, 1));
                                this.currentEpisodeIndex = 1;
                                this.currentPath = `${show.name}/Season ${seasonNum}`;
                            }
                        }
                    }
                    break;

                case 3: // p {show}/{season}/{episode}
                    const searchResult = await MovieDbService.searchMulti(parts[0], true);
                    this.currentSearchResult = searchResult;
                    if (this.currentSearchResult?.results?.length > 0) {
                        const show = this.currentSearchResult.results[0];
                        const seasonNum = parseInt(parts[1]);
                        const epNum = parseInt(parts[2]);
                        if (show.media_type === "tv" && !isNaN(seasonNum) && !isNaN(epNum)) {
                            this.currentMediaResult = show;
                            this.currentSeason = await MovieDbService.getSeasonDetails(show.id, seasonNum);
                            this.playEpisode(MovieDbService.getEpisodeUrl(show.id, seasonNum, epNum));
                            this.currentEpisodeIndex = epNum;
                            this.currentPath = `${show.name}/Season ${seasonNum}`;
                        }
                    }
                    break;

                default:
                    this.handleOutput("Invalid path format. Use: p {show} or p {show}/{season} or p {show}/{season}/{episode}");
                    break;
            }
        } catch (error) {
            this.handleOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private playNextEpisode(): void {
        if (this.currentMediaResult === null || this.currentSeason === null || this.currentEpisodeIndex === -1) {
            this.handleOutput("I do not know which episode was your last.");
            return;
        }

        this.playEpisode(MovieDbService.getEpisodeUrl(
            this.currentMediaResult.id,
            this.currentSeason.season_number,
            this.currentEpisodeIndex + 1
        ));
        this.currentEpisodeIndex++;
    }

    private playMovie(movieId: string): void {
        this.handleOutput("Playing movie...");
        const url = `${this.MOVIE_BASE_URL}${movieId}`;
        window.dispatchEvent(new CustomEvent('playVideo', { detail: url }));
    }

    private playEpisode(url: string): void {
        this.handleOutput("Playing episode...");
        window.dispatchEvent(new CustomEvent('playVideo', { detail: url }));
    }

    private clearConsole(): void {
        this.handleOutput('CLEAR');
        this.printLogo();
    }

    private async downloadMedia(argument: string): Promise<void> {
        const mediaName = argument ?? "Media";
        this.handleOutput('Downloading ' + mediaName + '...');
        const randomDelay = Math.floor(Math.random() * 4000) + 1000; // Random delay between 1 to 6 seconds
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        this.handleOutput("An Error occurred while downloading " + mediaName + ": err69420: Implementation deferred due to resource allocation constraints and development cycle optimization.");
    }
}
