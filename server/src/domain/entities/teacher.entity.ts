export class Teacher {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly assignedClassId: string | null,
    private _password: string
  ) {}
  public getPassword() { return this._password; }
}