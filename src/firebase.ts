import { Manga } from "./manga";

const firebase = require("firebase-admin");
const serviceAccount = require(".././mangareminder-d3ade-firebase-adminsdk-3fnz5-e3642b393c.json");

export default class Firebase {

    protected database: any

    constructor() {
        const app = firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: "https://mangareminder-d3ade-default-rtdb.europe-west1.firebasedatabase.app"
        });

        this.database = firebase.database()


    }

    getData() {
        return this.database.ref('manga').once('value')
            .then(function (snapshot: any) {
                return snapshot.val()
            })
    }

    postData(mangas: Array<Manga>) {
        this.database.ref("manga").set(mangas, function (error: Error) {
            if (error) {
                // The write failed...
                console.log("Failed with error: " + error)
            } else {
                // The write was successful...
                console.log("success")
            }
        })
    }
}
