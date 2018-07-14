import { NodeSecureService } from "./NodeSecureService";
/**
 * SecureServiceFactory
 */
export class SecureServiceFactory {
    static createService(secretKey) {
        if (!SecureServiceFactory.service) {
            SecureServiceFactory.service = new NodeSecureService(secretKey);
        }
        return SecureServiceFactory.service;
    }
    static getService() {
        return SecureServiceFactory.service;
    }
}
