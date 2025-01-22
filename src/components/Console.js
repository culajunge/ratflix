import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { ConsoleApp } from '../services/ConsoleApp';
const Console = () => {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const consoleRef = useRef(null);
    const consoleAppRef = useRef(new ConsoleApp((output) => {
        if (output === 'CLEAR') {
            setHistory([]);
        }
        else {
            setHistory(prev => [...prev, output]);
        }
    }));
    const formatCommandLine = (line) => {
        if (line.startsWith('>')) {
            // This is a command input line
            const parts = line.split(' ');
            const pathAndPrompt = parts[0].split('/');
            const path = pathAndPrompt[0].substring(2); // Remove '> '
            const command = parts[1];
            const args = parts.slice(2).join(' ');
            return (_jsxs(_Fragment, { children: [_jsx("span", { style: { color: 'var(--path-color)' }, children: path }), _jsx("span", { style: { color: 'var(--prompt-color)' }, children: "/>" }), ' ', _jsx("span", { style: { color: 'var(--command-color)' }, children: command }), args && _jsxs("span", { style: { color: 'var(--args-color)' }, children: [" ", args] })] }));
        }
        return line;
    };
    const renderInput = (input) => {
        const parts = input.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');
        return (_jsxs(_Fragment, { children: [_jsx("span", { style: { color: 'var(--command-color)' }, children: command }), args && _jsxs("span", { style: { color: 'var(--args-color)' }, children: [" ", args] })] }));
    };
    const [cursorPosition, setCursorPosition] = useState(0);
    const measureText = (text) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = getComputedStyle(document.body).font;
            return context.measureText(text.substring(0, cursorPosition)).width;
        }
        return 0;
    };
    // At the top of your component, update the state type
    const [history, setHistory] = useState([]);
    const handleCommand = async (command) => {
        const currentPathSnapshot = consoleAppRef.current.getCurrentPath();
        const formattedCommand = (_jsxs(_Fragment, { children: [_jsx("span", { style: { color: 'var(--path-color)' }, children: currentPathSnapshot }), _jsx("span", { style: { color: 'var(--prompt-color)' }, children: "/>" }), ' ', _jsx("span", { style: { color: 'var(--command-color)' }, children: command.split(' ')[0] }), command.split(' ').slice(1).join(' ') &&
                    _jsxs("span", { style: { color: 'var(--args-color)' }, children: [" ", command.split(' ').slice(1).join(' ')] })] }));
        setHistory(prev => [...prev, formattedCommand]);
        await consoleAppRef.current.handleCommand(command);
        setInput('');
    };
    const handleKeyDown = async (e) => {
        console.log('Key pressed:', e.key);
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                await handleCommand(input.trim());
            }
        }
    };
    const handleConsoleClick = () => {
        inputRef.current && inputRef.current.focus();
    };
    // In the preventBlur function inside useEffect:
    const preventBlur = (e) => {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    // In the history effect:
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        const consoleElement = consoleRef.current;
        if (consoleElement) {
            const scrollHeight = consoleElement.scrollHeight;
            consoleElement.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history]);
    const [hasMounted, setHasMounted] = useState(false);
    // Initial focus and scroll
    // One-time initialization
    useEffect(() => {
        consoleAppRef.current.initialize();
    }, []);
    useEffect(() => {
        inputRef.current.focus();
        if (consoleRef.current) {
            consoleRef.current.scrollTo({
                top: consoleRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history]);
    return (_jsx("div", { className: "console-container", onClick: handleConsoleClick, children: _jsx("form", { onSubmit: (e) => e.preventDefault(), className: "console-container", onClick: handleConsoleClick, children: _jsxs("div", { className: "console", ref: consoleRef, children: [history.map((line, i) => (_jsx("div", { className: "console-line", children: typeof line === 'string'
                            ? _jsx("span", { dangerouslySetInnerHTML: { __html: line } })
                            : line }, i))), _jsxs("div", { className: "input-line", children: [_jsx("span", { style: { color: 'var(--path-color)' }, children: consoleAppRef.current.getCurrentPath() }), _jsx("span", { style: { color: 'var(--prompt-color)' }, children: "/>" }), ' ', _jsxs("div", { className: "input-wrapper", style: { '--cursor-position': `${measureText(input)}px` }, children: [renderInput(input), _jsx("textarea", { ref: inputRef, value: input, onChange: (e) => {
                                            setInput(e.target.value);
                                            setCursorPosition(e.target.selectionStart || 0);
                                        }, onKeyPress: (e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if (input.trim()) {
                                                    handleCommand(input.trim());
                                                }
                                            }
                                        }, rows: 1, spellCheck: false, style: { opacity: 0, position: 'absolute', left: 0 } })] })] }), _jsx("div", { className: "console-spacer" })] }) }) }));
};
export default Console;
