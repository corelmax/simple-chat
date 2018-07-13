"use strict";
var IProfile;
(function (IProfile) {
    class Profile {
        constructor() {
            this.uid = "";
            this.username = "";
            this.password = "";
            this.firstname = "";
            this.lastname = "";
            this.status = "";
            this.tel = "";
            this.email = "";
            this.image = "";
        }
    }
    IProfile.Profile = Profile;
})(IProfile || (IProfile = {}));
module.exports = IProfile;
