import { Manga } from "./manga";
require('dotenv').config();

// const admin = require("firebase-admin");

import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";


export default class Firebase {

    protected database: any

    constructor() {


        const firebaseConfig = {
            apiKey: "AIzaSyAYVSkC1RfUjE8beR5soS19ZcmlIjy2TF4",
            authDomain: "mangareminder-d3ade.firebaseapp.com",
            databaseURL: "https://mangareminder-d3ade-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "mangareminder-d3ade",
            storageBucket: "mangareminder-d3ade.appspot.com",
            messagingSenderId: "353703660144",
            appId: "1:353703660144:web:004f7548bb9cb6d77c02b5"
        }

        const app = initializeApp(firebaseConfig);
        this.database = getDatabase();
        this.getData();
        // const serviceAccount = {
        //     "type": process.env.type,
        //     "project_id": process.env.project_id,
        //     "private_key_id": process.env.private_key_id,
        //     "private_key": process.env.private_key,
        //     "client_email": process.env.client_email,
        //     "client_id": process.env.client_id,
        //     "auth_uri": process.env.auth_uri,
        //     "token_uri": process.env.token_uri,
        //     "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
        //     "client_x509_cert_url": process.env.client_x509_cert_url
        // }


        // admin.initializeApp({
        //     credential: admin.credential.cert(serviceAccount),
        //     databaseURL: "https://mangareminder-d3ade-default-rtdb.europe-west1.firebasedatabase.app"
        // });

        // this.database = admin.database()



    }



    getData() {
        const dbRef = ref(getDatabase())
        return get(child(dbRef, 'data')).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val().manga ? snapshot.val().manga : snapshot.val()
            } else {
                console.log("No data available")
                return []
            }
        }).catch((error) => {
            console.error(error)
            return []
        });
    } 

    postData(manga: Array<Manga>) {

        // console.log("manga : ", manga);
        const db = getDatabase();
        set(ref(db, 'data'), {
            manga
        }).then((result) => {
            console.log("DATABASE UPDATED")
        }).catch((error) => {
            console.error(error)
        });



        // this.database.ref("manga").set(mangas, function (error: Error) {
        //     if (error) {
        //         // The write failed...
        //         console.log("Failed with error: " + error)
        //     } else {
        //         // The write was successful...
        //         console.log("success")
        //     }
        // })
    }
}
