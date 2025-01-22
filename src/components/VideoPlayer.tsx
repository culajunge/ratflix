import {useEffect, useState} from 'react';
import './VideoPlayer.css';

export const VideoPlayer: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Expose this method to be called from ConsoleApp
    const playVideo = (url: string) => {
        setVideoUrl(url);
    };

    useEffect(() => {
        const handlePlay = (e: CustomEvent) => {
            setVideoUrl(e.detail);
        };

        window.addEventListener('playVideo', handlePlay as EventListener);
        return () => window.removeEventListener('playVideo', handlePlay as EventListener);
    }, []);


    return (
        <div className="video-container">
            {videoUrl ? (
                <iframe
                    src={videoUrl}
                    allow="fullscreen"
                    width="100%"
                    height="100%"
                />
            ) : (
                <div className="video-placeholder">
                    <img src="/ratflix.webp" alt="video icon" className="video-icon" />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;