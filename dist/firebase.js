"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase-admin");
const serviceAccount = require(".././mangareminder-d3ade-firebase-adminsdk-3fnz5-e3642b393c.json");
class Firebase {
    constructor() {
        const app = firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: "https://mangareminder-d3ade-default-rtdb.europe-west1.firebasedatabase.app"
        });
        this.database = firebase.database();
    }
    getData() {
        return this.database.ref('manga').once('value')
            .then(function (snapshot) {
            return snapshot.val();
        });
    }
    postData(mangas) {
        this.database.ref("manga").set(mangas, function (error) {
            if (error) {
                // The write failed...
                console.log("Failed with error: " + error);
            }
            else {
                // The write was successful...
                console.log("success");
            }
        });
    }
}
exports.default = Firebase;
