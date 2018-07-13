import { IMessage, IMessageMeta } from "stalk-js/starter/models";
export declare class MessageImp implements IMessage {
    _id: string;
    rid: string;
    type: string;
    body: string;
    src: any;
    sender: string;
    createTime: Date;
    readers: string[];
    meta: IMessageMeta;
    target: string | string[];
    user: {
        _id: string;
        username: string;
        avatar: string;
    };
    uuid: string;
    status: string;
    constructor();
}
