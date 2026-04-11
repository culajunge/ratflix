import React, {useEffect, useState, useRef} from 'react';
import VideoPlayer from './VideoPlayer.tsx';
import {ConsoleStore} from '../store/consoleStore.ts';
import {GuiState} from '../types/GuiState.ts';
import {MediaResult, Season} from '../types/MediaTypes.ts';
import {WatchProgress} from '../types/WatchHistory.ts';
import './GuiView.css';

interface GuiViewProps {
    videoUrl: string | null;
    isVideoVisible: boolean;
}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w200';

const GuiView: React.FC<GuiViewProps> = ({videoUrl, isVideoVisible}) => {
    const [guiState, setGuiState] = useState<GuiState>({
        mode: 'home',
        searchResults: [],
        currentMedia: null,
        currentSeason: null,
        currentEpisodeIndex: -1,
        watchHistory: [],
    });
    const [searchInput, setSearchInput] = useState('');
    const [providers, setProviders] = useState<{ name: string }[]>([]);
    const [providerIndex, setProviderIndex] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Listen for state updates from ConsoleApp
        const handleGuiState = (e: CustomEvent) => {
            setGuiState(e.detail as GuiState);
        };
        window.addEventListener('guiStateUpdate', handleGuiState as EventListener);

        // Import MovieDbService to get providers
        import('../services/MovieDbService.ts').then(({MovieDbService}) => {
            setProviders(MovieDbService.vidProviders);
            setProviderIndex(MovieDbService.currentVidProviderIndex);
        });

        // Seed watch history on mount
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]') as WatchProgress[];
        setGuiState(prev => ({...prev, watchHistory: history, mode: 'home'}));

        return () => {
            window.removeEventListener('guiStateUpdate', handleGuiState as EventListener);
        };
    }, []);

    const runCommand = (cmd: string) => {
        const consoleApp = ConsoleStore.getConsoleApp();
        consoleApp?.handleCommand(cmd);
    };

    const app = () => ConsoleStore.getConsoleApp()!;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            // Optimistically set mode to search so panel switches immediately
            // before the async results come back
            setGuiState(prev => ({
                ...prev,
                mode: 'search',
                searchResults: [],
                currentMedia: null,
                currentSeason: null,
            }));
            app().search(searchInput.trim());
        }
    };

    const handleHomeClick = () => {
        app().resetState();
        setSearchInput('');
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]') as WatchProgress[];
        setGuiState({
            mode: 'home',
            searchResults: [],
            currentMedia: null,
            currentSeason: null,
            currentEpisodeIndex: -1,
            watchHistory: history,
        });
    };

    const handleSelectResult = (index: number) => {
        app().selectMediaByIndex(index);
    };

    const handleSelectSeason = (seasonNum: number) => {
        app().selectSeasonByNumber(seasonNum);
    };

    const handlePlayEpisode = (episodeNum: number) => {
        app().playEpisodeByNumber(episodeNum);
    };

    const handlePlayMedia = (index: number) => {
        // For search results: select then play
        app().selectMediaByIndex(index).then(() => {
            const selected = ConsoleStore.getConsoleApp()!;
            if ((selected as any).currentMediaResult?.media_type === 'movie') {
                app().playCurrentMovie();
            } else {
                app().playEpisodeByNumber(1);
            }
        });
    };

    const handlePlayFromHistory = (progress: WatchProgress) => {
        app().playFromHistory(progress);
    };

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idx = parseInt(e.target.value);
        setProviderIndex(idx);
        app().setProviderIndex(idx);
    };

    const handleNext = () => app().playNextEpisode();

    const handlePrev = () => {
        const instance = ConsoleStore.getConsoleApp() as any;
        const currentEp = instance?.currentEpisodeIndex ?? -1;
        if (currentEp > 1) app().playEpisodeByNumber(currentEp - 1);
    };

    const handleBack = () => app().goBack();

    const switchToCli = () => {
        window.dispatchEvent(new CustomEvent('switchView', {detail: 'cli'}));
    };

    // ── Panel content ───────────────────────────────────────────────
    const renderPanel = () => {
        const {mode, searchResults, currentMedia, currentSeason, watchHistory} = guiState;

        if (mode === 'season' && currentSeason) {
            return (
                <div className="gui-panel">
                    <div className="gui-panel-header">
                        <button className="gui-back-btn" onClick={() => runCommand('cd ..')}>← Back</button>
                        <span>{currentMedia?.name} — Season {currentSeason.season_number}</span>
                    </div>
                    <div className="gui-tiles">
                        {currentSeason.episodes.map(ep => (
                            <div key={ep.id} className="gui-tile gui-tile--episode">
                                <div className="gui-tile-info">
                                    <span className="gui-tile-ep-num">E{ep.episode_number}</span>
                                    <span className="gui-tile-title">{ep.name}</span>
                                </div>
                                <button
                                    className={`gui-play-btn ${guiState.currentEpisodeIndex === ep.episode_number ? 'gui-play-btn--active' : ''}`}
                                    onClick={() => handlePlayEpisode(ep.episode_number)}
                                >▶
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (mode === 'media' && currentMedia?.media_type === 'tv') {
            // Show seasons list — fetch via ls equivalent
            // We trigger ls and let guiState update to 'season' level
            // For now render a seasons prompt
            return (
                <div className="gui-panel">
                    <div className="gui-panel-header">
                        <button className="gui-back-btn" onClick={handleBack}>← Back</button>
                        <span>{currentMedia.name}</span>
                    </div>
                    <SeasonList mediaId={currentMedia.id} onSelect={handleSelectSeason}/>
                </div>
            );
        }

        if (mode === 'media' && currentMedia?.media_type === 'movie') {
            return (
                <div className="gui-panel">
                    <div className="gui-panel-header">
                        <button className="gui-back-btn" onClick={handleBack}>← Back</button>
                        <span>Movie</span>
                    </div>
                    <div className="gui-tiles">
                        <div className="gui-tile">
                            <div className="gui-tile-info">
                                <span className="gui-tile-title">{currentMedia.title}</span>
                                <span className="gui-tile-meta">{currentMedia.release_date?.slice(0, 4)}</span>
                            </div>
                            <button className="gui-play-btn" onClick={() => runCommand('p')}>▶</button>
                        </div>
                    </div>
                </div>
            );
        }

        if (mode === 'search' && searchResults.length > 0) {
            return (
                <div className="gui-panel">
                    <div className="gui-panel-header">
                        <span>Results</span>
                    </div>
                    <div className="gui-tiles">
                        {searchResults.map((result, i) => (
                            <div key={result.id} className="gui-tile">
                                <div className="gui-tile-info">
                                    <span className="gui-tile-title">{result.title ?? result.name}</span>
                                    <span className="gui-tile-meta">
                                        {result.media_type === 'tv' ? 'TV' : 'Movie'} · {(result.release_date ?? result.first_air_date ?? '').slice(0, 4)}
                                    </span>
                                </div>
                                <div className="gui-tile-actions">
                                    <button className="gui-select-btn" onClick={() => handleSelectResult(i)}>→</button>
                                    <button className="gui-play-btn" onClick={() => handlePlayMedia(i)}>▶</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Home — watch history
        return (
            <div className="gui-panel">
                <div className="gui-panel-header">
                    <span>Continue watching</span>
                </div>
                {watchHistory.length === 0 ? (
                    <p className="gui-empty">No history yet. Search for something to watch.</p>
                ) : (
                    <div className="gui-tiles">
                        {[...watchHistory].reverse().map((h) => (
                            <div key={h.showId} className="gui-tile">
                                <div className="gui-tile-info">
                                    <span className="gui-tile-title">{h.showName}</span>
                                    <span className="gui-tile-meta">S{h.seasonNumber} E{h.episodeNumber}</span>
                                </div>
                                <div className="gui-tile-actions">
                                    <button className="gui-play-btn" onClick={() => handlePlayFromHistory(h)}>▶</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="gui-root">
            {/* ── Header ── */}
            <header className="gui-header">
                <span className="gui-logo" onClick={handleHomeClick}>ratflix</span>

                <form className="gui-search-form" onSubmit={handleSearch}>
                    <input
                        ref={searchRef}
                        className="gui-search-input"
                        type="text"
                        placeholder="Search movies & shows..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="gui-search-btn">Search</button>
                </form>

                <button className="gui-cli-btn" onClick={switchToCli}>&gt;_ CLI</button>
            </header>

            {/* ── Body ── */}
            <div className="gui-body">
                <aside className="gui-sidebar">
                    {renderPanel()}
                </aside>

                <main className="gui-main">
                    {videoUrl && isVideoVisible
                        ? <div className="gui-player-wrapper"><VideoPlayer/></div>
                        : <div className="gui-placeholder">
                            <img src="/ratflix.webp" alt="ratflix" className="gui-placeholder-logo"/>
                            <p>Select something to watch</p>
                        </div>
                    }
                </main>
            </div>

            {/* ── Footer ── */}
            <footer className="gui-footer">
                <button className="gui-nav-btn" onClick={handlePrev}>⏮ Prev</button>

                <select
                    className="gui-provider-select"
                    value={providerIndex}
                    onChange={handleProviderChange}
                >
                    {providers.map((p, i) => (
                        <option key={i} value={i}>{p.name}</option>
                    ))}
                </select>

                <button className="gui-nav-btn" onClick={handleNext}>Next ⏭</button>
            </footer>
        </div>
    );
};

// ── SeasonList sub-component ─────────────────────────────────────────────────
// Fetches season count directly since ConsoleApp doesn't expose it as structured data

import {MovieDbService} from '../services/MovieDbService.ts';

const SeasonList: React.FC<{ mediaId: number; onSelect: (n: number) => void }> = ({mediaId, onSelect}) => {
    const [seasons, setSeasons] = useState<number[]>([]);

    useEffect(() => {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        fetch(`https://api.themoviedb.org/3/tv/${mediaId}?api_key=${API_KEY}`)
            .then(r => r.json())
            .then(data => {
                const nums = Array.from({length: data.number_of_seasons}, (_, i) => i + 1);
                setSeasons(nums);
            });
    }, [mediaId]);

    return (
        <div className="gui-tiles">
            {seasons.map(n => (
                <div key={n} className="gui-tile">
                    <div className="gui-tile-info">
                        <span className="gui-tile-title">Season {n}</span>
                    </div>
                    <button className="gui-select-btn" onClick={() => onSelect(n)}>→</button>
                </div>
            ))}
        </div>
    );
};

export default GuiView;