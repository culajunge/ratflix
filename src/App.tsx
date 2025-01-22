import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

