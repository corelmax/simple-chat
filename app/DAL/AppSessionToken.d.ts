export declare class AppSessionToken {
    store: LocalForage;
    constructor();
    getSessionToken(): Promise<{}>;
    saveSessionToken(token: string): Promise<string>;
    deleteSessionToken(): void;
}
