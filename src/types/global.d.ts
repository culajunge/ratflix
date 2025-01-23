export {};  // This makes the file a module

declare global {
    interface Window {
        ratflixCurrentVideo: CustomEvent | null;
    }
}
