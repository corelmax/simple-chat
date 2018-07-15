import * as CryptoJS from "crypto-js";

import { ISecureService } from "./ISecureService";

export class NodeSecureService implements ISecureService {
    key: string;
    passiv: string;

    constructor(secretKey: string) {
        this.key = secretKey;
        this.passiv = "chitchat#1234";
    }

    hashCompute(content: string) {
        return new Promise((resolve: (data: string) => void, reject) => {
            const hash = CryptoJS.MD5(content);
            resolve(hash.toString());
        });
    }

    encryption(content: string): Promise<string> {
        const self = this;

        return new Promise<string>((resolve, reject) => {
            const ciphertext = CryptoJS.AES.encrypt(content, self.key);
            if (!!ciphertext) {
                resolve(ciphertext.toString());
            } else {
                reject();
            }
        });
    }

    decryption(content: string): Promise<string> {
        const self = this;
        return new Promise((resolve, reject) => {
            const bytes = CryptoJS.AES.decrypt(content, self.key);
            const plaintext = bytes.toString(CryptoJS.enc.Utf8);
            if (!!plaintext) {
                resolve(plaintext);
            } else {
                reject();
            }
        });
    }
    encryptWithSecureRandom(content: string, callback: (err: Error | undefined, value: string) => void) {
        const self = this;
        const key = CryptoJS.enc.Utf8.parse(self.key);
        const iv = CryptoJS.enc.Utf8.parse(self.passiv);
        const ciphertext = CryptoJS.AES.encrypt(content, key, { iv });
        callback(undefined, ciphertext.toString());
    }
    public decryptWithSecureRandom(content: string): Promise<string> {
        const self = this;

        return new Promise((resolve, rejected) => {
            const key = CryptoJS.enc.Utf8.parse(self.key);
            const iv = CryptoJS.enc.Utf8.parse(self.passiv);
            const bytes = CryptoJS.AES.decrypt(content, key, { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });

            console.log(key, iv, bytes, content);
            try {
                const plaintext = bytes.toString(CryptoJS.enc.Utf8);
                resolve(plaintext);
            } catch (e) {
                console.error(e);
                rejected(e);
            }
        });
    }
}
