import * as cryptoHelper from "./CryptoHelper";
import * as iSecureService from "./secure/ISecureService";
import * as nodeSecureService from "./secure/NodeSecureService";
import * as secureServiceFactory from "./secure/SecureServiceFactory";
export declare namespace SecureUtils {
    export import CryptoHelper = cryptoHelper;
    export import SecureServiceFactory = secureServiceFactory;
    export import ISecureService = iSecureService;
    export import NodeSecureService = nodeSecureService;
}
