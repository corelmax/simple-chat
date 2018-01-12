import { ISecureService } from "./ISecureService";
/**
 * SecureServiceFactory
 */
export declare class SecureServiceFactory {
    static service: ISecureService;
    static createService(secretKey: string): ISecureService;
    static getService(): ISecureService;
}
