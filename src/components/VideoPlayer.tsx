import {useEffect, useState} from 'react';
import './VideoPlayer.css';

export const VideoPlayer: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handlePlay = (e: CustomEvent) => {
        console.log("Video URL received:", e.detail);
        setVideoUrl(e.detail);
    };

    useEffect(() => {
        window.addEventListener('playVideo', handlePlay as EventListener);

        // Get any existing video URL from the event that triggered the component mount
        const currentEvent = window.ratflixCurrentVideo;
        if (currentEvent) {
            handlePlay(currentEvent);
        }

        return () => window.removeEventListener('playVideo', handlePlay as EventListener);
    }, []);

    return (
        <div className="video-container">
            {videoUrl ? (
                <iframe
                    key={videoUrl} // Force iframe refresh on URL change
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