import { APIGatewayProxyHandler } from "aws-lambda";
import { UsersRepository } from "src/repositories/implementations/UsersRepository";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById({ id });

  let response = { message: `User was not found!`, user };
  let statusCode = 404;

  if (user) {
    response = { user, message: "It was found" };
    statusCode = 200;
  }
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
