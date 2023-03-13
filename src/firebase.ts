import { Manga } from "./manga";
require('dotenv').config();

import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
export default class Firebase {

    protected database: any
    protected ref: any

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
        this.database = getDatabase(app);
        this.ref = ref(this.database, 'data/manga');
    }

    getData() {
        return get(this.ref).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                console.log("No data available")
                return []
            }
        }).catch((error) => {
            console.error(error)
            return []
        });
    }

    postData(mangas: Array<Manga>) {

        set(this.ref, mangas).then((result => {
            console.log("Data is up to date")
        })).catch((error) => {
            console.error("Failed with error: " + error)
        })
        
        // this.database.ref("manga").set(mangas, function (error: Error) {
        //     if (error) {
        //         // The write failed...
        //         console.log("Failed with error: " + error)
        //     } else {
        //         // The write was successful...
        //         console.log("Data is up to date")
        //     }
        // })
    }
}
