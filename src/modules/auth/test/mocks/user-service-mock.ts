export class UserServiceMock {
  async findOne(data): Promise<void> {
    console.log(data)
  }
}
