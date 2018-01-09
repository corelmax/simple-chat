export interface IMessageDAL {
    getData(rid: string): Promise<any>;
    saveData(rid: string, chatRecord: any[]): Promise<any>;
    removeData(rid: string, callback?: (err: Error, res: any) => void): void;
    clearData(next: (err?: Error) => void): void;
}
