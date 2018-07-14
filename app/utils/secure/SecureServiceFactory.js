import { NodeSecureService } from "./NodeSecureService";
/**
 * SecureServiceFactory
 */
var SecureServiceFactory = /** @class */ (function () {
    function SecureServiceFactory() {
    }
    SecureServiceFactory.createService = function (secretKey) {
        if (!SecureServiceFactory.service) {
            SecureServiceFactory.service = new NodeSecureService(secretKey);
        }
        return SecureServiceFactory.service;
    };
    SecureServiceFactory.getService = function () {
        return SecureServiceFactory.service;
    };
    return SecureServiceFactory;
}());
export { SecureServiceFactory };
