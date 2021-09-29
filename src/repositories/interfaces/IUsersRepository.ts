interface ICreateUserDTO {
  id: string;
  grade: string;
  name: string;
}

interface IUpdateUserDTO {
  id: string;
  grade: string;
  name: string;
  certificate: string;
}

interface IUsersRepository {
  findById(data: { id: string }): Promise<ICreateUserDTO>;
  create(data: ICreateUserDTO): Promise<void>;
  update({ id, name, grade, certificate }: IUpdateUserDTO): Promise<void>;
}

export { IUsersRepository, ICreateUserDTO, IUpdateUserDTO };
