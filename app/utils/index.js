import * as cryptoHelper from "./CryptoHelper";
import * as secureServiceFactory from "./secure/SecureServiceFactory";
import * as iSecureService from "./secure/ISecureService";
import * as nodeSecureService from "./secure/NodeSecureService";
export var SecureUtils;
(function (SecureUtils) {
    SecureUtils.CryptoHelper = cryptoHelper;
    SecureUtils.SecureServiceFactory = secureServiceFactory;
    SecureUtils.ISecureService = iSecureService;
    SecureUtils.NodeSecureService = nodeSecureService;
})(SecureUtils || (SecureUtils = {}));
