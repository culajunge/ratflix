import { MovieDbService } from './MovieDbService.ts';
import { MediaResult, SearchResult, Season, TvShowDetails } from '../types/MediaTypes.ts';
import {WatchProgress} from '../types/WatchHistory.ts';
import {Simulate} from "react-dom/test-utils";
import { HfInference } from "@huggingface/inference";
import progress = Simulate.progress;

export class ConsoleApp {

    private hasInitialized = false;

    public async initialize(): Promise<void> {
        if (this.hasInitialized) return;
        this.hasInitialized = true;
        await this.applySettings();
        this.printLogo();
    }

    private defaultPromptSymbol = "/>";

    private currentPath: string = '';
    private currentSearchResult: SearchResult | null = null;
    private currentMediaResult: MediaResult | null = null;
    private currentMediaIndex: number = -1;
    private currentSeason: Season | null = null;
    private currentSeasonIndex: number = -1;
    private currentEpisodeIndex: number = -1;

    private currentURL: string = '';

    private currentWatchHistory: WatchProgress[] = [];

    API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    BASE_URL = "https://api.themoviedb.org/3";
    domainSuffix = "xyz";
    MOVIE_BASE_URL = `https://vidsrc.${this.domainSuffix}/embed/movie?tmdb=`;
    TV_BASE_URL = `https://vidsrc.${this.MOVIE_BASE_URL}/embed/tv?tmdb=`;

    HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

    private availableFonts = [
        'Courier New',
        'Monaco',
        'Fira Code',
        'Source Code Pro',
        'JetBrains Mono',
        'Hack',
        'Ubuntu Mono',
        'Consolas',
        'Menlo',
        'Roboto Mono'
    ];

    private hfClient: HfInference;

    constructor(public handleOutput: (text: string) => void) {
        this.hfClient = new HfInference(this.HF_API_KEY);
    }


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
                    await this.playNextEpisode();
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

                case 'pr':
                case 'prov':
                case 'provider':
                    this.handleProvider(argument);
                    break;

                case 'tgl':
                case 'toggle':
                    this.toggleVideo();
                    break;

                case 'cust':
                case 'custom':
                    const [command2, ...args2] = input.trim().split(' ');
                    const argument2 = args2.join(' ');
                    await this.handleCustomization(argument2);
                    break;

                case 'url':
                    this.handleOutput(this.currentURL);
                    break;

                case 'ai':
                    if(argument){
                        await this.handleAIQuery(argument);
                    }else {
                        this.handleOutput('Usage: ai &lt;query&gt;');
                    }

                case 'echo':
                    this.Echo(argument);
                    break;

                case 'gh':
                case 'github':
                case 'cr':
                case 'credits':
                case 'credit':
                    this.OpenGitHubRepo();
                    break;

                case 'hello':
                    if(argument.toLowerCase() === 'there'){
                        this.handleOutput('GENERAL KENOBI!');
                    }
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
        const settings = this.loadSettings();
        var title = settings['--title-text'].replace(/['"]/g, '');
        this.handleOutput(`<span style="color: ${settings['--title-color']};font-weight: bold">${title}</span>`);
    }

    public getCurrentPath(): string {
        return this.currentPath;
    }

    private OpenGitHubRepo(): void {
        const repoUrl = "https://github.com/culajunge/ratflix";
        window.open(repoUrl, "_blank");
    }

    private DisplaySearchResult(): void{

        if(this.currentSearchResult!.results.length <= 0){
            this.handleOutput("No results found.");
            return;
        }

        this.currentSearchResult!.results.forEach((result, index) => {
            this.handleOutput(`${index + 1}. ${result.title ?? result.name} (${result.media_type})`);
        });
        this.handleOutput("...");
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
            "pr              - Display available providers",
            "clear           - Clear the console",
            "pwd             - Print the current path",
            "tgl             - toggle video player",
            "cust            - Customize colors c[colorindex], prompt symbol ps and title t",
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
                    this.playEpisode(await MovieDbService.getEpisodeUrl(this.currentMediaResult.id, 1, 1));
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
                        this.playEpisode(await MovieDbService.getEpisodeUrl(
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
                            this.currentMediaResult = media;
                            this.currentMediaResult.media_type = "movie";
                            this.playMovie(media.id.toString());
                        } else if (media.media_type === "tv") {
                            this.currentMediaResult = media;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.id, 1);
                            this.currentEpisodeIndex = 1;
                            this.currentPath = `${media.name}/Season 1`;
                            this.playEpisode(await MovieDbService.getEpisodeUrl(media.id, 1, 1));
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
                        this.playEpisode(await MovieDbService.getEpisodeUrl(media.showId, media.seasonNumber, media.episodeNumber + 1));
                        break;
                    }

                    // Handle search by name
                    // Handle search by name
                    const searchResult2 = await MovieDbService.searchMulti(parts[0], true);
                    this.currentSearchResult = searchResult2;

                    if (this.currentSearchResult?.results?.length > 0) {
                        const media = this.currentSearchResult.results[0];
                        if (media.media_type === "movie") {
                            this.currentMediaResult = media;
                            this.currentMediaResult.media_type = "movie";
                            this.playMovie(media.id.toString());
                        } else if (media.media_type === "tv") {
                            this.currentMediaResult = media;
                            this.currentSeason = await MovieDbService.getSeasonDetails(media.id, 1);
                            this.currentEpisodeIndex = 1;
                            this.currentPath = `${media.name}/Season 1`;
                            this.playEpisode(await MovieDbService.getEpisodeUrl(media.id, 1, 1));
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
                            this.playEpisode(await MovieDbService.getEpisodeUrl(this.currentMediaResult.id, seasonNum, epNum));
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
                                this.playEpisode(await MovieDbService.getEpisodeUrl(show.id, seasonNum, 1));
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
                            this.playEpisode(await MovieDbService.getEpisodeUrl(show.id, seasonNum, epNum));
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

    public async playNextEpisode(): Promise<void> {
        if (this.currentMediaResult === null || this.currentSeason === null || this.currentEpisodeIndex === -1) {
            if(this.currentMediaResult !== null && this.currentMediaResult.media_type === 'movie'){
                return;
            }
            this.handleOutput("I do not know which episode was your last.");
            return;
        }

        if(this.currentSeason.episodes.length === this.currentEpisodeIndex) {
            this.currentEpisodeIndex = 1;
            this.currentSeason = await MovieDbService.getSeasonDetails(this.currentMediaResult.id, this.currentSeason.season_number + 1);
        }else{
            this.currentEpisodeIndex++;
        }

        this.playEpisode(await MovieDbService.getEpisodeUrl(
            this.currentMediaResult.id,
            this.currentSeason.season_number,
            this.currentEpisodeIndex
        ));
    }

    private async playMovie(movieId: string): Promise<void> {
        console.log("Dispatching playVideo event with URL:", `${this.MOVIE_BASE_URL}${movieId}`); // Debug log
        this.handleOutput(`Playing: ${this.currentMediaResult!.title ?? this.currentMediaResult!.name}`);
        const url = await MovieDbService.getMovieUrl(movieId);
        this.currentURL = url;
        window.dispatchEvent(new CustomEvent('playVideo', { detail: url }));
    }

    private async playEpisode(url: string): Promise<void> {
        this.handleOutput(`Playing: ${this.currentMediaResult?.name} S${this.currentSeason?.season_number} E${this.currentEpisodeIndex}`);
        this.currentURL = url;
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

                this.playEpisode(await MovieDbService.getEpisodeUrl(
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

            this.playEpisode(await MovieDbService.getEpisodeUrl(
                this.currentMediaResult.id,
                progress.seasonNumber,
                this.currentEpisodeIndex
            ));
        } else {
            this.handleOutput("Current media is not a TV show.");
        }

        console.log('Current Episode Index:', this.currentEpisodeIndex, 'Offset:', offset);
    }

    private toggleVideo(): void {
        window.dispatchEvent(new CustomEvent('toggleVideo'));
        this.handleOutput("Video player visibility toggled");
    }

    private handleProvider(arg: string): void {
        if (arg.length === 0) {
            // List all providers with their indices
            MovieDbService.vidProviders.forEach((provider, index) => {
                const current = index === MovieDbService.currentVidProviderIndex ? " (current)" : "";
                this.handleOutput(`${index + 1}: ${provider.name}${current}`);
            });
            return;
        }

        const newIndex = parseInt(arg[0]) - 1;
        if (isNaN(newIndex) || newIndex < 0 || newIndex >= MovieDbService.vidProviders.length) {
            this.handleOutput(`Invalid provider index. Please choose between 0 and ${MovieDbService.vidProviders.length - 1}`);
            return;
        }

        MovieDbService.currentVidProviderIndex = newIndex;
        localStorage.setItem('vidProviderIndex', newIndex.toString());
        this.handleOutput(`Video provider set to: ${MovieDbService.vidProviders[newIndex].name}`);
    }


    private async handleCustomization(args: string): Promise<void> {

        if (args === '') {
            this.handleOutput(` Available customization commands:

Colors: cust c1 - Path color (current: ${this.loadSettings()['--path-color']}) 
cust c2 - Prompt color (current: ${this.loadSettings()['--prompt-color']}) 
cust c3 - Command color (current: ${this.loadSettings()['--command-color']}) 
cust c4 - Arguments color (current: ${this.loadSettings()['--args-color']}) 
cust c5 - Title color (current: ${this.loadSettings()['--title-color']}) 
cust c6 - Background color (current: ${this.loadSettings()['--background-color']})
cust c7 - Text output color (current: ${this.loadSettings()['--output-color']})

cust t - Change title text (current: ${this.loadSettings()['title-text']}) 
cust ps - Change prompt symbol (current: ${this.loadSettings()['--prompt-symbol']}) 
cust r - Reset all settings to default
cust exp - Export settings to JSON
cust imp - Import settings from JSON

Example: cust c1 ff0000`);
            return;
        }

        if (args.toLowerCase() === 'exp' || args.toLowerCase() === 'export') {
            this.exportSettings();
            return;
        }

        if (args.toLowerCase().startsWith('imp')) {
            const jsonStart = args.indexOf('{');
            if (jsonStart !== -1) {
                const jsonString = args.slice(jsonStart);
                await this.importSettings(jsonString);
                return;
            }
        }


        if (args.toLowerCase() === 'imp' || args.toLowerCase() === 'import') {
            const jsonString = args;
            await this.importSettings(jsonString);
            return;
        }

        if (args.toLowerCase() === 'cr') {
            localStorage.removeItem('consoleSettings');
            this.handleOutput("Settings reset to default: Reload site to apply");
            await this.applySettings();
            return;
        }

        if (args.toLowerCase() === 'r' || args.toLowerCase() === 'reset') {
            localStorage.removeItem('consoleSettings');

            const defaultSettings = {
                '--path-color': '#868686',
                '--prompt-color': '#ffffff',
                '--command-color': '#e74856',
                '--args-color': '#cbcbcb',
                '--prompt-symbol': '/>',
                '--title-color': '#e74856',
                '--title-text': 'ratflix',
                '--background-color': '#1e1e1e',
                '--output-color': '#fff',
                '--console-font': 'Courier New',
            };

            Object.entries(defaultSettings).forEach(([variable, value]) => {
                document.documentElement.style.setProperty(variable, value);
            });

            this.handleOutput("Settings reset to default");
            this.printLogo();
            return;
        }

        if (args.toLowerCase().startsWith('f') || args.toLowerCase().startsWith('font')) {
            // Extract the full font name by joining all arguments after 'f' or 'font'
            const fontArg = args.split(' ').slice(1).join(' ');

            if (!fontArg) {
                const fontList = this.availableFonts
                    .map((font, index) => `${index + 1}. ${font}`)
                    .join('\n');
                this.handleOutput(`Available fonts:\n${fontList}\n\nCurrent font: ${this.loadSettings()['--console-font']}\nUsage: cust f <index or font name>`);
                return;
            }

            // Check if the argument is a number (index)
            const fontIndex = parseInt(fontArg) - 1;
            if (!isNaN(fontIndex) && fontIndex >= 0 && fontIndex < this.availableFonts.length) {
                // Use the predefined font
                const selectedFont = this.availableFonts[fontIndex];
                this.applyFont(selectedFont);
                this.handleOutput(`Font updated to: ${selectedFont}`);
                return;
            }

            // If the argument is not a number, treat it as a font name
            const fontName = this.capitalizeFontName(fontArg.trim()); // Capitalize the font name
            try {
                await this.loadGoogleFont(fontName);
                this.applyFont(fontName);
                this.handleOutput(`Font updated to: ${fontName}`);
            } catch (error) {
                this.handleOutput(`Failed to load font "${fontName}". Falling back to default font.`);
                this.applyFont('Courier New'); // Fallback to a default font
            }
        }

        const [type, value] = args.split(' ');

        if (type.toLowerCase() === 'ps' || type.toLowerCase() === 'prompt') {
            const settings = this.loadSettings();
            settings['--prompt-symbol'] = value;
            localStorage.setItem('consoleSettings', JSON.stringify(settings));
            document.documentElement.style.setProperty('--prompt-symbol', value);
            return;
        }

        if (!type || !value) {
            this.handleOutput("Invalid format. Use: cust c[1-4] <hex color code>");
            return;
        }

        if (type.toLowerCase() === 't' || type.toLowerCase() === 'title') {
            const settings = this.loadSettings();
            settings['--title-text'] = value;
            localStorage.setItem('consoleSettings', JSON.stringify(settings));
            this.handleOutput(`Title updated to: ${value}`);
            this.printLogo();
            return;
        }

        const colorMap: { [key: string]: string } = {
            'c1': '--path-color',
            'C1': '--path-color',
            'color1': '--path-color',
            'c2': '--prompt-color',
            'C2': '--prompt-color',
            'color2': '--prompt-color',
            'c3': '--command-color',
            'C3': '--command-color',
            'color3': '--command-color',
            'c4': '--args-color',
            'C4': '--args-color',
            'color4': '--args-color',
            'c5': '--title-color',
            'C5': '--title-color',
            'color5': '--title-color',
            'c6': '--background-color',
            'C6': '--background-color',
            'color6': '--background-color',
            'c7': '--output-color',
            'C7': '--output-color',
            'color7': '--output-color',
        };

        const cssVariable = colorMap[type.toLowerCase()];
        if (!cssVariable) {
            this.handleOutput("Invalid color index. Use c1, c2, c3, or c4");
            return;
        }

        let formattedColor = value.startsWith('#') ? value : `#${value}`;

        if (!/^#[0-9A-Fa-f]{6}$/.test(formattedColor)) {
            this.handleOutput("Invalid hex color code. Use format: RRGGBB or #RRGGBB");
            return;
        }

        document.documentElement.style.setProperty(cssVariable, formattedColor);

        const settings = this.loadSettings();
        settings[cssVariable] = formattedColor;
        localStorage.setItem('consoleSettings', JSON.stringify(settings));

        this.handleOutput(`Updated ${cssVariable} to ${formattedColor}`);
    }

    private loadGoogleFont(fontName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}&display=swap`;

            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load font: ${fontName}`));

            document.head.appendChild(link);
        });
    }

    private applyFont(fontName: string): void {
        document.documentElement.style.setProperty('--console-font', `"${fontName}", monospace`);

        const settings = this.loadSettings();
        settings['--console-font'] = `"${fontName}", monospace`;
        localStorage.setItem('consoleSettings', JSON.stringify(settings));
    }

    private capitalizeFontName(fontName: string): string {
        return fontName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    public loadSettings(): { [key: string]: string } {
        const rootStyles = getComputedStyle(document.documentElement);
        const defaultSettings = {
            '--path-color': rootStyles.getPropertyValue('--path-color').trim(),
            '--prompt-color': rootStyles.getPropertyValue('--prompt-color').trim(),
            '--command-color': rootStyles.getPropertyValue('--command-color').trim(),
            '--args-color': rootStyles.getPropertyValue('--args-color').trim(),
            '--prompt-symbol': rootStyles.getPropertyValue('--prompt-symbol').trim() || this.defaultPromptSymbol,
            '--title-color': rootStyles.getPropertyValue('--title-color').trim(),
            '--title-text': rootStyles.getPropertyValue('--title-text').trim(),
            '--background-color': rootStyles.getPropertyValue('--background-color').trim(),
            '--output-color': rootStyles.getPropertyValue('--output-color').trim(),
            '--console-font': rootStyles.getPropertyValue('--console-font').trim() || 'Courier New',
        };

        const savedSettings = localStorage.getItem('consoleSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    private async applySettings(): Promise<void> {
        const settings = this.loadSettings();

        // Check if the font is a custom font (not in the availableFonts list)
        const fontName = settings['--console-font'].replace(/["']/g, '').split(',')[0].trim();
        if (!this.availableFonts.includes(fontName)) {
            try {
                await this.loadGoogleFont(fontName);
            } catch (error) {
                this.handleOutput(`Failed to load font "${fontName}". Falling back to default font.`);
                settings['--console-font'] = '"Courier New", monospace'; // Fallback to default font
            }
        }

        // Apply all settings
        Object.entries(settings).forEach(([variable, value]) => {
            document.documentElement.style.setProperty(variable, value);
        });
    }

    private exportSettings(): void {
        const settings = this.loadSettings();
        const jsonOutput = JSON.stringify(settings, null, 2);

        const themeName = settings['--title-text'].replace(/ /g, '-');
        this.handleOutput(`\`\`\`${themeName} theme`);
        this.handleOutput(jsonOutput);
        this.handleOutput('```');
    }

    private async importSettings(jsonString: string): Promise<void> {
        try {
            // Remove any markdown code block markers if present
            const cleanJson = jsonString.replace(/```json|```/g, '').trim();
            const newSettings = JSON.parse(cleanJson);

            // Validate that all required properties exist
            const requiredKeys = [
                '--path-color',
                '--prompt-color',
                '--command-color',
                '--args-color',
                '--title-color',
                '--background-color',
                '--output-color',
                '--prompt-symbol',
                '--title-text',
                '--console-font'
            ];

            const hasAllKeys = requiredKeys.every(key => key in newSettings);
            if (!hasAllKeys) {
                this.handleOutput('Invalid settings format: Missing required properties');
                return;
            }

            const fontName = newSettings['--console-font'].replace(/["']/g, '').split(',')[0].trim();
            if (!this.availableFonts.includes(fontName)) {
                try {
                    await this.loadGoogleFont(fontName);
                } catch (error) {
                    this.handleOutput(`Failed to load font "${fontName}". Falling back to default font.`);
                    newSettings['--console-font'] = '"Courier New", monospace'; // Fallback to default font
                }
            }

            // Save to localStorage and apply
            localStorage.setItem('consoleSettings', JSON.stringify(newSettings));
            await this.applySettings();
            this.handleOutput('Theme imported successfully! New settings applied.');
            this.printLogo(); // Refresh the logo with new colors
        } catch (error) {
            this.handleOutput('Invalid JSON format. Please check your input.');
        }
    }

    aiPrePromt = "You are a helpful AI assistant in a terminal-based movie streaming app called ratflix. " +
        "You are called ratflixAI. Keep responses short, concise and relevant to movies and TV shows when possible. " +
        "Format lists with bullet points. Include movie ratings when mentioning specific titles." +
        "Keep in mind that your complete answer will be visible to the user";

    private async handleAIQuery(query: string): Promise<void> {
        try {
            this.handleOutput("Thinking...");

            // noinspection TypeScriptValidateTypes
            const completion = await this.hfClient.textGeneration({
                model: "microsoft/phi-2",
                inputs: `System: ${this.aiPrePromt}\nUser: ${query}\nAssistant:`,
                parameters: {
                    max_new_tokens: 256,
                    temperature: 0.7,
                    top_p: 0.9,
                    return_full_text: false
                }
            });

            // Remove any echoed user input from the response
            let response = completion.generated_text;
            if (response.toLowerCase().includes(query.toLowerCase())) {
                response = response.substring(query.length).trim();
            }

            this.handleOutput(response);

        } catch (error) {
            if (error.response?.status === 503) {
                this.handleOutput("Model is currently loading. Please try again in a few moments.");
            } else {
                this.handleOutput(`Error: ${error.message}`);
            }
        }
    }
}
