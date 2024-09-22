
import Server from "./server";
import Deploy from "./deploy";

const server = new Server(6001)
const deploy = new Deploy()

var cron = require('node-cron');
cron.schedule('0 8-23/2 * * *', () => {
    deploy.run()
});

// server.start()


