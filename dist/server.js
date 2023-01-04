"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
class Server {
    constructor(port) {
        this.port = port;
    }
    start() {
        const app = express();
        app.get('/', function (req, res) {
            res.send('Hello world');
        });
        app.listen(this.port, function () {
            console.log("Serveur démarré");
        });
    }
}
exports.default = Server;
