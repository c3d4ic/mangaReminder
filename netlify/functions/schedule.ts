import { schedule } from "@netlify/functions"
import Deploy from "./../../src/deploy"

const deploy = new Deploy()


export const handler = schedule("* * * * *", async (event: any) => {

    console.log("Scheduled function executed")
    // deploy.run();
    return {
        statusCode: 200,
    }
})
