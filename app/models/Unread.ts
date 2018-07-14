import { IMessage } from "stalk-js/starter/models";

export class Unread {
    message: IMessage | undefined;
    rid: string = "";
    count: number = 0;
}
