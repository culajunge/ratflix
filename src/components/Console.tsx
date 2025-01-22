import { useState, useRef, useEffect } from 'react';
import { ConsoleApp } from '../services/ConsoleApp';

const Console: React.FC = () => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const consoleRef = useRef<HTMLDivElement | null>(null);
    const consoleAppRef = useRef<ConsoleApp>(new ConsoleApp((output: string) => {
        if (output === 'CLEAR') {
            setHistory([]);
        } else {
            setHistory(prev => [...prev, output]);
        }
    }));

    const formatCommandLine = (line: string) => {
        if (line.startsWith('>')) {
            // This is a command input line
            const parts = line.split(' ');
            const pathAndPrompt = parts[0].split('/');
            const path = pathAndPrompt[0].substring(2); // Remove '> '
            const command = parts[1];
            const args = parts.slice(2).join(' ');

            return (
                <>
                    <span style={{color: 'var(--path-color)'}}>{path}</span>
                    <span style={{color: 'var(--prompt-color)'}}>/&gt;</span>
                    {' '}
                    <span style={{color: 'var(--command-color)'}}>{command}</span>
                    {args && <span style={{color: 'var(--args-color)'}}> {args}</span>}
                </>
            );
        }
        return line;
    };
    const renderInput = (input: string) => {
        const parts = input.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');

        return (
            <>
                <span style={{color: 'var(--command-color)'}}>{command}</span>
                {args && <span style={{color: 'var(--args-color)'}}> {args}</span>}
            </>
        );
    };
    const [cursorPosition, setCursorPosition] = useState(0);
    const measureText = (text: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = getComputedStyle(document.body).font;
            return context.measureText(text.substring(0, cursorPosition)).width;
        }
        return 0;
    };

    // At the top of your component, update the state type
    const [history, setHistory] = useState<(string | JSX.Element)[]>([]);

    const handleCommand = async (command: string) => {
        const currentPathSnapshot = consoleAppRef.current.getCurrentPath();
        const formattedCommand = (
            <>
                <span style={{color: 'var(--path-color)'}}>{currentPathSnapshot}</span>
                <span style={{color: 'var(--prompt-color)'}}>/&gt;</span>
                {' '}
                <span style={{color: 'var(--command-color)'}}>{command.split(' ')[0]}</span>
                {command.split(' ').slice(1).join(' ') &&
                    <span style={{color: 'var(--args-color)'}}> {command.split(' ').slice(1).join(' ')}</span>}
            </>
        );
        setHistory(prev => [...prev, formattedCommand]);
        await consoleAppRef.current.handleCommand(command);
        setInput('');
    };


    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log('Key pressed:', e.key);
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                await handleCommand(input.trim());
            }
        }
    };

    const handleConsoleClick = () => {
        inputRef.current && inputRef.current!.focus();
    };

    // In the preventBlur function inside useEffect:
    const preventBlur = (e: MouseEvent) => {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current!.focus();
        }
    };

// In the history effect:
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current!.focus();
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
        inputRef.current!.focus();
        if (consoleRef.current) {
            consoleRef.current!.scrollTo({
                top: consoleRef.current!.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history]);


    return (
        <div className="console-container" onClick={handleConsoleClick}>
            <form onSubmit={(e) => e.preventDefault()} className="console-container" onClick={handleConsoleClick}>
                <div className="console" ref={consoleRef}>
                    {history.map((line, i) => (
                        <div key={i} className="console-line">
                            {typeof line === 'string'
                                ? <span dangerouslySetInnerHTML={{ __html: line }} />
                                : line
                            }
                        </div>
                    ))}
                    <div className="input-line">
                        <span style={{color: 'var(--path-color)'}}>{consoleAppRef.current.getCurrentPath()}</span>
                        <span style={{color: 'var(--prompt-color)'}}>/&gt;</span>
                        {' '}
                        <div className="input-wrapper" style={{'--cursor-position': `${measureText(input)}px`} as React.CSSProperties}>
                            {renderInput(input)}
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setCursorPosition(e.target.selectionStart || 0);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (input.trim()) {
                                            handleCommand(input.trim());
                                        }
                                    }
                                }}
                                rows={1}
                                spellCheck={false}
                                style={{ opacity: 0, position: 'absolute', left: 0 }}
                            />
                        </div>
                    </div>
                    <div className="console-spacer"></div>
                </div>
            </form>
        </div>
    );

};

export default Console;