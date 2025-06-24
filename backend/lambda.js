// lambda.js
const serverlessExpress = require("@vendia/serverless-express");
const app = require("./server"); // Import your modified server.js file

let server;

// This function initializes the serverless-express wrapper
// It ensures that the Express app is only initialized once per Lambda execution environment
async function createServer() {
  if (!server) {
    server = serverlessExpress({ app });
  }
  return server;
}

// This is the main handler function that AWS Lambda will invoke
exports.handler = async (event, context) => {
  // You can log the event to see what API Gateway sends
  // console.log('API Gateway Event:', JSON.stringify(event, null, 2));

  // If you need specific context logging or modification
  // context.callbackWaitsForEmptyEventLoop = false; // Optional: Helps with persistent connections

  const serverInstance = await createServer();
  return serverInstance(event, context);
};
