export class MockUserModel {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(data): Promise<any> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async create(data): Promise<any>{}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<boolean> {
    return true
  }
}
