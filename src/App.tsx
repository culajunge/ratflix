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

function getInitialViewMode(): ViewMode {
    const saved = localStorage.getItem('viewMode');
    return saved === 'cli' || saved === 'gui' ? saved : DEFAULT_VIEW;
}

function App() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isVideoVisible, setIsVideoVisible] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode());
    const appReady = useRef(false);

    if (!ConsoleStore.getConsoleApp()) {
        const app = new ConsoleApp((text: string) => {
        });
        ConsoleStore.setConsoleApp(app);
    }

    useEffect(() => {
        if (appReady.current) return;
        appReady.current = true;
        ConsoleStore.getConsoleApp()!.initialize();
    }, []);

    useEffect(() => {
        const handleVideoPlay = (e: CustomEvent) => {
            window.ratflixCurrentVideo = e;
            setVideoUrl(e.detail);
            setIsVideoVisible(true);
        };
        const handleToggle = () => setIsVideoVisible(prev => !prev);
        const handleSwitchView = (e: CustomEvent) => {
            const mode = e.detail as ViewMode;
            setViewMode(mode);
            localStorage.setItem('viewMode', mode);
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