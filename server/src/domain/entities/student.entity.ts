export class Student {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly teacherId: string,
    public readonly progressReports: string[],
    private _password: string
  ) {}
  public getPassword() { return this._password; }
}