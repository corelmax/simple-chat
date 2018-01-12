import * as cryptoHelper from "./CryptoHelper";
import * as secureServiceFactory from "./secure/SecureServiceFactory";
import * as iSecureService from "./secure/ISecureService";
import * as nodeSecureService from "./secure/NodeSecureService";

export namespace SecureUtils {
    export import CryptoHelper = cryptoHelper;
    export import SecureServiceFactory = secureServiceFactory;
    export import ISecureService = iSecureService;
    export import NodeSecureService = nodeSecureService;
}
