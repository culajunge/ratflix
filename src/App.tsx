import './App.css'

import Console from './components/Console';
import './components/Console.css';

import VideoPlayer from './components/VideoPlayer';

function App() {
    return (
        <div className="app-container">
            <VideoPlayer />
            <Console />
        </div>
    );
}

export default App;

