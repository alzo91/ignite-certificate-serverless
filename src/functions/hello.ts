import { APIGatewayProxyHandler } from "aws-lambda";
import dayjs from "dayjs";

export const handle: APIGatewayProxyHandler = async (event) => {
  const to_day = dayjs().format("YYYY-MM-DD HH:mm");
  console.log(`>>> Hello.handle ${to_day} => ${event.body}`);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Hello world that serverless",
      toDay: to_day,
      version: "v018",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
