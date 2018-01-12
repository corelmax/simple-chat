import { ISecureService } from "./ISecureService";
import { NodeSecureService } from "./NodeSecureService";
/**
 * SecureServiceFactory
 */
export class SecureServiceFactory {
    public static service: ISecureService;
    public static createService(secretKey: string): ISecureService {
        if (!SecureServiceFactory.service) {
            SecureServiceFactory.service = new NodeSecureService(secretKey) as ISecureService;
        }

        return SecureServiceFactory.service;
    }
    static getService() {
        return SecureServiceFactory.service;
    }
}
