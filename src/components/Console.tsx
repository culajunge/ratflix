import { useState, useRef, useEffect } from 'react';
import { ConsoleApp } from '../services/ConsoleApp.tsx';
import {ConsoleStore} from "../store/consoleStore.ts";

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

    const renderInput = (input: string) => {
        const parts = input.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');

        // noinspection XmlDeprecatedElement
        return (
            <span style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                minWidth: '8px' // This ensures there's always space for the cursor
            }}>
            <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
                        e.preventDefault();
                        handleCommand(input.trim());
                    }
                }}
                onMouseUp={(e) => {
                    // Prevent the textarea from losing focus
                    e.preventDefault();
                    if (inputRef.current) {
                        inputRef.current!.focus();
                    }
                }}
                rows={1}
                wrap="off"
                spellCheck={false}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    color: 'transparent',
                    caretColor: '#fff',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    padding: 0,
                    margin: 0,
                    font: 'inherit',
                    lineHeight: 'inherit',
                    whiteSpace: 'pre',
                    WebkitTextFillColor: 'transparent',
                    WebkitUserModify: 'read-write-plaintext-only',
                    userSelect: 'none',
                    overflow: 'hidden'
                }}
            />
            <span style={{
                display: 'inline',
                pointerEvents: 'none',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre' // Preserves spaces
            }}>
                <span style={{ color: 'var(--command-color)' }}>{command}</span>
                {args && <span style={{ color: 'var(--args-color)' }}>{args ? ` ${args}` : ''}</span>}
            </span>
        </span>
        );
    };
    const [isFocused, setIsFocused] = useState(true);

    const [history, setHistory] = useState<(string | JSX.Element)[]>([]);

    const handleCommand = async (command: string) => {
        const currentPathSnapshot = consoleAppRef.current.getCurrentPath();
        const formattedCommand = (
            <>
                <span style={{ color: 'var(--path-color)' }}>{currentPathSnapshot}</span>
                <span style={{ color: 'var(--prompt-color)' }}>
                {getComputedStyle(document.documentElement).getPropertyValue('--prompt-symbol').replace(/['"]/g, '')}
            </span>
                <span style={{ color: 'var(--command-color)' }}>{command.split(' ')[0]}</span>
                {command.split(' ').slice(1).join(' ') && (
                    <span style={{ color: 'var(--args-color)' }}> {command.split(' ').slice(1).join(' ')}</span>
                )}
            </>
        );
        setHistory(prev => [...prev, formattedCommand]);
        await consoleAppRef.current.handleCommand(command);
        setInput('');
    };
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log(e.key);
        if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
            // Prevent the default action first
            e.preventDefault();
            e.stopPropagation();

            // Only execute if not pressing shift and there's content
            if (!e.shiftKey && input.trim()) {
                await handleCommand(input.trim());
                return false;
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        console.log('handleSubmit called');
        e.preventDefault();
        if (input.trim()) {
            await handleCommand(input.trim());
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
        ConsoleStore.setConsoleApp(consoleAppRef.current);
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
            <form
                onSubmit={handleSubmit}
                className="console-container"
                onClick={handleConsoleClick}
            >
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
                        <span style={{
                            color: 'var(--path-color)',
                            flexShrink: 0
                        }}>{consoleAppRef.current.getCurrentPath()}</span>
                        <span style={{
                            color: 'var(--prompt-color)',
                            flexShrink: 0
                        }}>{getComputedStyle(document.documentElement).getPropertyValue('--prompt-symbol').replace(/['"]/g, '')}</span>
                        {renderInput(input)} {/* Removed the space character before renderInput */}
                    </div>
                    <div className="console-spacer" style={{ height: '20vh' }}></div>
                </div>
            </form>
        </div>
    );
};

export default Console;