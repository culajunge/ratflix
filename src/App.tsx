import './App.css'

import Console from './components/Console.tsx';
import './components/Console.css';

import VideoPlayer from './components/VideoPlayer.tsx';
import {useEffect, useState} from "react";

function App() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isVideoVisible, setIsVideoVisible] = useState(true);

    useEffect(() => {
        const handleVideoPlay = (e: CustomEvent) => {
            window.ratflixCurrentVideo = e;
            setVideoUrl(e.detail);
            setIsVideoVisible(true);
        };

        const handleToggle = () => {
            setIsVideoVisible(prev => !prev);
        };

        window.addEventListener('playVideo', handleVideoPlay as EventListener);
        window.addEventListener('toggleVideo', handleToggle);

        return () => {
            window.removeEventListener('playVideo', handleVideoPlay as EventListener);
            window.removeEventListener('toggleVideo', handleToggle);
        };
    }, []);

    return (
        <div className="app-container">
            {videoUrl && isVideoVisible && <VideoPlayer />}
            <Console />
        </div>
    );
}

export default App;
