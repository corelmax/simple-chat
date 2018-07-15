import * as cryptoHelper from "./CryptoHelper";
import * as iSecureService from "./secure/ISecureService";
import * as nodeSecureService from "./secure/NodeSecureService";
import * as secureServiceFactory from "./secure/SecureServiceFactory";
export var SecureUtils;
(function (SecureUtils) {
    SecureUtils.CryptoHelper = cryptoHelper;
    SecureUtils.SecureServiceFactory = secureServiceFactory;
    SecureUtils.ISecureService = iSecureService;
    SecureUtils.NodeSecureService = nodeSecureService;
})(SecureUtils || (SecureUtils = {}));
