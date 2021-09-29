import { document } from "src/utils/dynamodbClient";
import {
  ICreateUserDTO,
  IUpdateUserDTO,
  IUsersRepository,
} from "../interfaces/IUsersRepository";

class UsersRepository implements IUsersRepository {
  private TableName = "users_certificates";

  async findById({ id }: { id: string }): Promise<ICreateUserDTO> {
    const users = await document
      .query({
        TableName: this.TableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
      })
      .promise();

    const existUser = users.Items[0];

    if (!existUser) return undefined;

    const user = {
      id: existUser.id,
      grade: existUser.grade,
      name: existUser.full_name,
      certificate: existUser.certificate,
    };

    return user;
  }

  async create(data: ICreateUserDTO): Promise<void> {
    const { name, id, grade } = data;
    await document
      .put({
        TableName: this.TableName,
        Item: { id, full_name: name, grade },
      })
      .promise();
  }

  async update({
    id,
    name,
    grade,
    certificate,
  }: IUpdateUserDTO): Promise<void> {
    //         KeyConditionExpression: "id = :id",
    // ExpressionAttributeValues: { ":id": id
    await document
      .update({
        TableName: this.TableName,
        Key: { id },
        UpdateExpression:
          "SET certificate = :certificate, full_name = :name, grade = :grade",
        ExpressionAttributeValues: {
          ":certificate": certificate,
          ":name": name,
          ":grade": grade,
        },
      })
      .promise();
  }
}

export { UsersRepository };
