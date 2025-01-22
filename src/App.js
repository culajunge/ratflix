import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import Console from './components/Console';
import './components/Console.css';
import VideoPlayer from './components/VideoPlayer';
function App() {
    return (_jsxs("div", { className: "app-container", children: [_jsx(VideoPlayer, {}), _jsx(Console, {})] }));
}
export default App;
