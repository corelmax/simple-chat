var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SecureServiceFactory } from "./secure/SecureServiceFactory";
import { MessageType } from "stalk-js/starter/models/index";
export const decryptionText = (message) => __awaiter(this, void 0, void 0, function* () {
    if (!message) {
        return message;
    }
    const secure = SecureServiceFactory.getService();
    if (message.type === MessageType[MessageType.Text]) {
        const result = yield secure.decryption(message.body);
        message.body = result;
        return message;
    }
    else {
        return message;
    }
});
export const hashComputation = (message) => {
    const secure = SecureServiceFactory.getService();
    return secure.hashCompute(message);
};
