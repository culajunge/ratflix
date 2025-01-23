import { MovieDbService } from './MovieDbService.ts';
import { MediaResult, SearchResult, Season, TvShowDetails } from '../types/MediaTypes.ts';

export class ConsoleApp {

    private hasInitialized = false;

    public initialize(): void {
        if (this.hasInitialized) return;
        this.hasInitialized = true;
        this.printLogo();
    }

    private currentPath: string = '';
    private currentSearchResult: SearchResult | null = null;
    private currentMediaResult: MediaResult | null = null;
    private currentMediaIndex: number = -1;
    private currentSeason: Season | null = null;
    private currentSeasonIndex: number = -1;
    private currentEpisodeIndex: number = -1;

    private currentWatchHistory: WatchProgress[] = [];

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

                case 'hi':
                case 'hs':
                case 'history':
                    this.displayWatchHistory();
                    break;

                case 'l':
                case 'last':
                    await this.playLastWatched();
                    break;

                case 'ln':
                case 'lastn':
                case 'lastnext':
                case 'lnext':
                    await this.playLastWatched(1);
                    break;

                case 'echo':
                    this.Echo(argument);
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

    private Echo(text: string): void {
        this.handleOutput(text);
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
            "f &lt;search term&gt;  - Find movies and TV shows",
            "cd &lt;index&gt;       - Change directory to a media item",
            "ls               - List items in the current directory",
            "p                - Play movie",
            "p &lt;index&gt;        - Play episode",
            "n                - Play next episode",
            "l                - Play last watched episode",
            "ln               - Play next episode of last watched episode",
            "hs               - Display watch history",
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
        this.currentEpisodeIndex = -1;
        this.currentMediaResult = null;
        this.currentSearchResult = null;
        this.currentWatchHistory = [];
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
                    if (this.currentSearchResult === null && this.currentWatchHistory.length <= 0) {
                        const searchResult = await MovieDbService.searchMulti(parts[0], true);
                        this.currentSearchResult = searchResult;
                        parts[0] = "1";
                    }else if(this.currentSearchResult === null && this.currentWatchHistory.length > 0) {
                        var num = parseInt(parts[0]);
                            const media = this.currentWatchHistory[num - 1];
                            const mediaResult = {
                                id: media.showId,
                                media_type: 'tv',
                                title: media.showName,
                                release_date: null,
                                name: media.showName,
                                first_air_date: null,
                                overview: media.showName,
                                vote_average: 69,
                            } as MediaResult;
                            this.currentMediaResult = mediaResult;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.showId, media.seasonNumber);
                            this.currentPath = `${media.showName}/Season ${media.seasonNumber}`;
                            break;
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
                            this.currentMediaResult = media;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.id, 1);
                            this.currentEpisodeIndex = 1;
                            this.currentPath = `${media.name}/Season 1`;
                            this.playEpisode(MovieDbService.getEpisodeUrl(media.id, 1, 1));
                            console.log("Duplicate code 1");
                        }
                        break;
                    }else if(!isNaN(num) && !this.currentSearchResult && this.currentWatchHistory.length > 0){
                        const media = this.currentWatchHistory[num - 1];
                        const mediaResult = {
                            id: media.showId,
                            media_type: 'tv',
                            title: media.showName,
                            release_date: null,
                            name: media.showName,
                            first_air_date: null,
                            overview: media.showName,
                            vote_average: 69,
                        } as MediaResult;
                        this.currentMediaResult = mediaResult;
                        this.currentSeason = await MovieDbService.getSeasonDetails(media.showId, media.seasonNumber);
                        this.currentEpisodeIndex = media.episodeNumber + 1;
                        this.currentPath = `${media.showName}/Season ${media.seasonNumber}`;
                        this.playEpisode(MovieDbService.getEpisodeUrl(media.showId, media.seasonNumber, media.episodeNumber + 1));
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
                            this.currentMediaResult = media;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.id, 1);
                            this.currentEpisodeIndex = 1;
                            this.currentPath = `${media.name}/Season 1`;
                            this.playEpisode(MovieDbService.getEpisodeUrl(media.id, 1, 1));
                            console.log("Duplicate code 2");
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
                            this.currentEpisodeIndex = epNum;
                            this.currentPath = `${this.currentMediaResult.name}/Season ${seasonNum}`;
                            this.playEpisode(MovieDbService.getEpisodeUrl(this.currentMediaResult.id, seasonNum, epNum));
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
                                this.currentEpisodeIndex = 1;
                                this.currentPath = `${show.name}/Season ${seasonNum}`;
                                this.playEpisode(MovieDbService.getEpisodeUrl(show.id, seasonNum, 1));
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
                            this.currentEpisodeIndex = epNum;
                            this.currentPath = `${show.name}/Season ${seasonNum}`;
                            this.playEpisode(MovieDbService.getEpisodeUrl(show.id, seasonNum, epNum));
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

    private playEpisode(url: string, epnum = -1): void {
        if(epnum != -1) {
            this.handleOutput("Playing episode " + epnum + "...");
        } else {
            this.handleOutput("Playing episode...");
        }

        // Save progress when playing an episode
        if (this.currentMediaResult?.media_type === 'tv') {
            this.saveWatchProgress(
                this.currentMediaResult.id,
                this.currentSeason?.season_number || 1,
                this.currentEpisodeIndex
            );
        }

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

    private saveWatchProgress(showId: number, seasonNumber: number, episodeNumber: number): void {
        let watchHistory: WatchProgress[] = this.getWatchHistory();
        const showName = this.currentMediaResult?.name || '';

        const existingIndex = watchHistory.findIndex(entry => entry.showId === showId);
        const newProgress: WatchProgress = {
            showId,
            seasonNumber,
            episodeNumber,
            showName
        };

        if (existingIndex !== -1) {
            // Remove the existing entry
            watchHistory.splice(existingIndex, 1);
        }

        // Add the new/updated entry at the end
        watchHistory.push(newProgress);

        localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
    }

// Modify the displayWatchHistory method
    private displayWatchHistory(): void {
        // Refresh the current watch history
        this.currentWatchHistory = this.getWatchHistory();

        if (this.currentWatchHistory.length === 0) {
            this.handleOutput("No watch history found.");
            return;
        }

        this.handleOutput("\nWatch History:");
        this.handleOutput("-------------");

        this.currentWatchHistory.forEach((progress, index) => {
            this.handleOutput(
                `${index + 1}. ${progress.showName}: Season ${progress.seasonNumber}, Episode ${progress.episodeNumber}`
            );
        });
    }


    private getWatchHistory(): WatchProgress[] {
        try {
            const history = localStorage.getItem('watchHistory');
            return history ? JSON.parse(history) : [];
        } catch {
            return [];
        }
    }

    private getShowProgress(showId: number): WatchProgress | null {
        const watchHistory = this.getWatchHistory();
        return watchHistory.find(entry => entry.showId === showId) || null;
    }

    private async playLastWatched(offset = 0): Promise<void> {
        if (this.currentMediaResult === null) {
            // Play the most recent show from history
            const watchHistory = this.getWatchHistory();
            if (watchHistory.length === 0) {
                this.handleOutput("No watch history found.");
                return;
            }

            // Get the last show (most recent)
            const lastWatched = watchHistory[watchHistory.length - 1];

            // Search for the show to get its full details
            const searchResult = await MovieDbService.searchMulti(lastWatched.showName, true);
            if (searchResult?.results?.length > 0) {
                this.currentMediaResult = searchResult.results[0];
                this.currentSeason = await MovieDbService.getSeasonDetails(lastWatched.showId, lastWatched.seasonNumber);
                this.currentEpisodeIndex = lastWatched.episodeNumber + offset;
                this.currentPath = `${lastWatched.showName}/Season ${lastWatched.seasonNumber}`;

                this.playEpisode(MovieDbService.getEpisodeUrl(
                    lastWatched.showId,
                    lastWatched.seasonNumber,
                    this.currentEpisodeIndex
                ));
            }
        } else if (this.currentMediaResult.media_type === 'tv') {
            // Play last watched episode of current show
            const progress = this.getShowProgress(this.currentMediaResult.id);
            if (!progress) {
                this.handleOutput("No watch history found for this show.");
                return;
            }

            this.currentSeason = await MovieDbService.getSeasonDetails(this.currentMediaResult.id, progress.seasonNumber);
            this.currentEpisodeIndex = progress.episodeNumber + offset;
            this.currentPath = `${this.currentMediaResult.name}/Season ${progress.seasonNumber}`;

            this.playEpisode(MovieDbService.getEpisodeUrl(
                this.currentMediaResult.id,
                progress.seasonNumber,
                this.currentEpisodeIndex
            ));
        } else {
            this.handleOutput("Current media is not a TV show.");
        }

        console.log('Current Episode Index:', this.currentEpisodeIndex, 'Offset:', offset);
    }

}
