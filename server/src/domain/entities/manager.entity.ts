export class Manager {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    private _password: string
  ) {}
  public getPassword() { return this._password; }
}