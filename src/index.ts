
import Server from "./server";
import Deploy from "./deploy";

const server = new Server(3000)
const deploy = new Deploy()

var cron = require('node-cron');

cron.schedule('0 8-23/2 * * *', () => {
    const date = new Date();
    console.log("Update le ",date)
    deploy.run()
});

// server.start()


