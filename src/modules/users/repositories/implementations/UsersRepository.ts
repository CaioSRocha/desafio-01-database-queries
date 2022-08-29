import { getRepository, RelationId, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOneOrFail(user_id, {
      relations: ["games"],
    });

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const user = await this.repository.query(
      "Select * from users order by first_name"
    );

    return user;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(
      `select * from users as u WHERE u.first_name = initcap($1) AND u.last_name = initcap($2)`,
      [first_name, last_name]
    );
  }
}
