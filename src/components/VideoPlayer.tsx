import {useEffect, useState, useRef} from 'react';
import './VideoPlayer.css';
import {ConsoleStore} from '../store/consoleStore.ts';

export const VideoPlayer: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [iframeReady, setIframeReady] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);


    const handleIframeLoad = () => {
        const consoleApp = ConsoleStore.getConsoleApp();
        setIframeReady(true);
    };
    const handlePlay = (e: CustomEvent) => {
        console.log("Video URL received:", e.detail);
        // Immediately set the URL when received
        if (e.detail) {
            setVideoUrl(e.detail);
            // Store the current video URL
            window.ratflixCurrentVideo = e;
        }
    };

    useEffect(() => {
        if (iframeReady && videoUrl) {
            // Give the iframe a moment to fully initialize
            const timer = setTimeout(() => {
                if (iframeRef.current?.contentWindow) {
                    // Send messages after ensuring iframe is ready
                    const commonMessages = [
                        {type: 'play'},
                        {action: 'play'},
                        'play'
                    ];
                    commonMessages.forEach(msg => {
                        iframeRef.current!.contentWindow?.postMessage({type: 'play'}, '*');
                    });
                } else {
                    console.log("Iframe not ready yet");
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [iframeReady, videoUrl]);

    useEffect(() => {
        window.addEventListener('playVideo', handlePlay as EventListener);

        // Check for existing video URL immediately
        const currentEvent = window.ratflixCurrentVideo;
        if (currentEvent) {
            handlePlay(currentEvent);
        }

        const handleMessage = (event: MessageEvent) => {
            console.log('Received message from iframe:', event.data);
            if (
                event.data === 'videoEnded' ||
                event.data.type === 'ended' ||
                event.data.event === 'ended' ||
                event.data.status === 'complete'
            ) {
                console.log('Video ended, attempting to play next episode');
                const consoleApp = ConsoleStore.getConsoleApp();
                if (consoleApp) {
                    consoleApp.playNextEpisode();
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('playVideo', handlePlay as EventListener);
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Only handle messages from our iframe
            if (event.source === iframeRef.current?.contentWindow) {
                // If the message indicates a new window/tab attempt, we block it
                if (event.data?.type === 'openWindow') {
                    event.preventDefault();
                    return false;
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [iframeReady]);


    return (
        <div className="video-container">
            {videoUrl ? (
                <iframe
                    ref={iframeRef}
                    key={videoUrl}
                    src={videoUrl}
                    //allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; autoplay; cross-origin-isolated; midi; sync-xhr; ambient-light-sensor; publickey-credentials-get"
                    allow="fullscreen *; autoplay *; clipboard-write *; encrypted-media *; picture-in-picture *; web-share *; autoplay *; cross-origin-isolated *; midi *; sync-xhr *; publickey-credentials-get"
                    allowFullScreen={true}
                    {...{allowfullscreen: true}}
                    width="100%"
                    height="100%"
                    onLoad={handleIframeLoad}
                    id="video_player_iframe"
                />
            ) : (
                <div className="video-placeholder">
                    <img src="/ratflix.webp" alt="video icon" className="video-icon"/>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;