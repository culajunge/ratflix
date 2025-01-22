import './App.css'

import Console from './components/Console.tsx';
import './components/Console.css';

import VideoPlayer from './components/VideoPlayer.tsx';

function App() {
    return (
        <div className="app-container">
            <VideoPlayer />
            <Console />
        </div>
    );
}

export default App;

