import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './VideoPlayer.css';
export const VideoPlayer = () => {
    const [videoUrl, setVideoUrl] = useState(null);
    // Expose this method to be called from ConsoleApp
    const playVideo = (url) => {
        setVideoUrl(url);
    };
    useEffect(() => {
        const handlePlay = (e) => {
            setVideoUrl(e.detail);
        };
        window.addEventListener('playVideo', handlePlay);
        return () => window.removeEventListener('playVideo', handlePlay);
    }, []);
    return (_jsx("div", { className: "video-container", children: videoUrl ? (_jsx("iframe", { src: videoUrl, allow: "fullscreen", width: "100%", height: "100%" })) : (_jsx("div", { className: "video-placeholder", children: _jsx("img", { src: "/ratflix.webp", alt: "video icon", className: "video-icon" }) })) }));
};
export default VideoPlayer;
