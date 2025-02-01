import './App.css';
import Console from './components/Console.tsx';
import './components/Console.css';
import VideoPlayer from './components/VideoPlayer.tsx';
import { useEffect, useState } from "react";

function App() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isVideoVisible, setIsVideoVisible] = useState(true);
    const [splitPosition, setSplitPosition] = useState(50); // Default split position (50%)

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

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = splitPosition;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + (deltaX / window.innerWidth) * 100;
            setSplitPosition(Math.max(10, Math.min(90, newWidth))); // Clamp between 10% and 90%
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="app-container">
            {videoUrl && isVideoVisible && (
                <div
                    className="video-container"
                    style={{ flex: splitPosition }}
                >
                    <VideoPlayer />
                </div>
            )}
            <div
                className="resizer"
                onMouseDown={handleMouseDown}
            />
            <div
                className="console-container"
                style={{ flex: 100 - splitPosition }}
            >
                <Console />
            </div>
        </div>
    );
}

export default App;