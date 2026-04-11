import './App.css'
import Console from './components/Console.tsx';
import './components/Console.css';
import VideoPlayer from './components/VideoPlayer.tsx';
import GuiView from './components/GuiView.tsx';
import {useEffect, useState, useRef} from "react";
import {ConsoleApp} from './services/ConsoleApp.tsx';
import {ConsoleStore} from './store/consoleStore.ts';

type ViewMode = 'cli' | 'gui';
const DEFAULT_VIEW: ViewMode = 'gui';

function App() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isVideoVisible, setIsVideoVisible] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW);
    const appReady = useRef(false);

    // Create and register ConsoleApp once, regardless of view mode
    useEffect(() => {
        if (appReady.current) return;
        appReady.current = true;

        // Only create if not already registered (Console.tsx may do it too)
        if (!ConsoleStore.getConsoleApp()) {
            const app = new ConsoleApp((text: string) => {
                // In GUI mode we don't render output anywhere visible,
                // but we still need the side effects (state changes, events)
                // Console.tsx will override this handler when in CLI mode
            });
            ConsoleStore.setConsoleApp(app);
            app.initialize();
        }
    }, []);

    useEffect(() => {
        const handleVideoPlay = (e: CustomEvent) => {
            window.ratflixCurrentVideo = e;
            setVideoUrl(e.detail);
            setIsVideoVisible(true);
        };
        const handleToggle = () => setIsVideoVisible(prev => !prev);
        const handleSwitchView = (e: CustomEvent) => {
            setViewMode(e.detail as ViewMode);
        };

        window.addEventListener('playVideo', handleVideoPlay as EventListener);
        window.addEventListener('toggleVideo', handleToggle);
        window.addEventListener('switchView', handleSwitchView as EventListener);

        return () => {
            window.removeEventListener('playVideo', handleVideoPlay as EventListener);
            window.removeEventListener('toggleVideo', handleToggle);
            window.removeEventListener('switchView', handleSwitchView as EventListener);
        };
    }, []);

    if (viewMode === 'gui') {
        return <GuiView videoUrl={videoUrl} isVideoVisible={isVideoVisible}/>;
    }

    return (
        <div className="app-container">
            {videoUrl && isVideoVisible && <VideoPlayer/>}
            <Console/>
        </div>
    );
}

export default App;