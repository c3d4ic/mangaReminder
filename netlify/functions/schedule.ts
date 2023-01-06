// import { schedule } from "@netlify/functions"

// export const handler = schedule("* * * * *", async (event: any) => {

//     console.log("Scheduled function executed")

//     return {
//         statusCode: 200,
//         body: "Hello from schedule function"
//     }
// })

import { Handler, HandlerEvent, HandlerContext, schedule } from "@netlify/functions";
import Deploy from "./../../src/deploy"

const myHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // console.log("Received event:", event);

    const deploy = new Deploy()

    return {
        statusCode: 200,
    };
};

const handler = schedule("0-15-30-45 * * * *", myHandler)

export { handler };
