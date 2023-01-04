import { schedule } from "@netlify/functions"

export const handler = schedule("* * * * *", async (event: any) => {

    console.log("Scheduled function executed")

    return {
        statusCode: 200,
        body: "Hello from schedule function"
    }
})
