import { ConsoleApp } from '../services/ConsoleApp';

export class ConsoleStore {
    private static instance: ConsoleApp | null = null;

    public static setConsoleApp(app: ConsoleApp) {
        this.instance = app;
    }

    public static getConsoleApp(): ConsoleApp | null {
        return this.instance;
    }
}