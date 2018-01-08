
import { UserRole } from "./UserRole";

namespace IProfile {
    export interface IProfile {
        uid: string;
        username: string;
        password: string;
        firstname: string;
        lastname: string;
        status: string;
        tel: string;
        email: string;
        image: any;
        role: UserRole;
    }

    export class Profile implements IProfile {
        uid: string;
        username: string;
        password: string;
        firstname: string;
        lastname: string;
        status: string;
        tel: string;
        email: string;
        image: any;
        role: UserRole;
    }
}
export = IProfile;
