// // src/infrastructure/repositories/mongo-user.repository.ts
// export class MongoUserRepository implements IUserRepository {
//   async save(user: User): Promise<void> {
//     const mongoData = UserMapper.toPersistence(user);
//     await UserModel.create(mongoData);
//   }
// }