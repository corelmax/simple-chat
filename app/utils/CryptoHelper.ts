import { MessageType } from "stalk-js/starter/models/index";
import { MessageImp } from "../models/index";
import { SecureServiceFactory } from "./secure/SecureServiceFactory";

export const decryptionText = async (message: MessageImp) => {
    if (!message) { return message; }

    const secure = SecureServiceFactory.getService();

    if (message.type === MessageType[MessageType.Text]) {
        const result = await secure.decryption(message.body);
        message.body = result;

        return message;
    } else {
        return message;
    }
};

export const hashComputation = (message: string): Promise<string> => {
    const secure = SecureServiceFactory.getService();
    return secure.hashCompute(message);
};
