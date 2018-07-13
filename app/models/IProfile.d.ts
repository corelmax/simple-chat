import { UserRole } from "./UserRole";
declare namespace IProfile {
    interface IProfile {
        uid: string;
        username: string;
        password: string;
        firstname: string;
        lastname: string;
        status: string;
        tel: string;
        email: string;
        image: any;
        role: UserRole | undefined;
    }
    class Profile implements IProfile {
        uid: string;
        username: string;
        password: string;
        firstname: string;
        lastname: string;
        status: string;
        tel: string;
        email: string;
        image: any;
        role: UserRole | undefined;
    }
}
export = IProfile;
