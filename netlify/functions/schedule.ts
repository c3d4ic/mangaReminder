import { schedule } from "@netlify/functions"
import Deploy from "./../../src/deploy"

export const handler = schedule("* * * * *", async (event: any) => {

    console.log("Scheduled function executed")
    const deploy = new Deploy()

    return {
        statusCode: 200,
    }
})
