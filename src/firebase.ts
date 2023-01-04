import { Manga } from "./manga";
require('dotenv').config();

const firebase = require("firebase-admin");

export default class Firebase {

    protected database: any

    constructor() {

        const serviceAccount = {
            "type": process.env.type,
            "project_id": process.env.project_id,
            "private_key_id": process.env.private_key_id,
            "private_key": process.env.private_key,
            "client_email": process.env.client_email,
            "client_id": process.env.client_id,
            "auth_uri": process.env.auth_uri,
            "token_uri": process.env.token_uri,
            "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
            "client_x509_cert_url": process.env.client_x509_cert_url
        }

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
                console.log("Data is up to date")
            }
        })
    }
}
