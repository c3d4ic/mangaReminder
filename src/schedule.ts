// import { schedule } from "@netlify/functions"

// export const handler = schedule("* * * * *", async (event: any) => {

//     console.log("Scheduled function executed")

//     return {
//         statusCode: 200,
//         body: "Hello from schedule function"
//     }
// })

import { Handler, HandlerEvent, HandlerContext, schedule } from "@netlify/functions";

const myHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    console.log("Received event:", event);

    return {
        statusCode: 200,
    };
};

const handler = schedule("@hourly", myHandler)

export { handler };
