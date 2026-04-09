import { Email } from '../value-objects/email.value-object';
import { Gender } from '../enums';

export type TeacherLevel =
  | 'primary'           // Grade 1-5
  | 'middle'            // Grade 6-8
  | 'secondary'         // Grade 9-10
  | 'higher_secondary'  // Grade 11-12
  | 'all'               // Can teach any level


export interface TeacherProps {
  id?: string;
  email: string;
  passwordHash?: string;      // optional — not set until first-time setup
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: Gender;
  phone: string;
  address?: string;
  hireDate?: string;
  qualification?: string;
  designation?: string;
  level: TeacherLevel
  deptId: string;
  subjectIds?: string[];
  isActive?: boolean;
  isVerified?: boolean;     // ← added
  isFirstTime?: boolean;     // ← added
  lastLogin?: Date;        // ← added
  createdBy?: string;      // ← added (FK > manager.id)
  createdAt?: Date;
  updatedAt?: Date;
}

export class TeacherEntity {
  private readonly _id?: string;
  private _email: Email;
  private _passwordHash?: string;
  private _firstName: string;
  private _lastName: string;
  private _dob?: string;
  private _gender?: Gender;
  private _phone: string;
  private _address?: string;
  private _hireDate?: string;
  private _qualification?: string;
  private _designation?: string;
  private _deptId: string;
  private _level: TeacherLevel;
  private _subjectIds: string[];
  private _isActive: boolean;
  private _isVerified: boolean;      // ← added
  private _isFirstTime: boolean;      // ← added
  private _lastLogin?: Date;         // ← added
  private _createdBy?: string;       // ← added
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TeacherProps) {
    this._id = props.id;
    this._email = Email.create(props.email);
    this._passwordHash = props.passwordHash;
    this._firstName = this.requireNonEmpty(props.firstName, 'firstName');
    this._lastName = this.requireNonEmpty(props.lastName, 'lastName');
    this._dob = props.dob;
    this._gender = props.gender;
    this._level = props.level
    this._subjectIds = props.subjectIds ?? []
    this._phone = props.phone;
    this._address = props.address;
    this._hireDate = props.hireDate;
    this._qualification = props.qualification;
    this._designation = props.designation;
    this._deptId = props.deptId;
    this._isActive = props.isActive ?? true;
    this._isVerified = props.isVerified ?? false;   // ← added
    this._isFirstTime = props.isFirstTime ?? true;    // ← added
    this._lastLogin = props.lastLogin;              // ← added
    this._createdBy = props.createdBy;              // ← added
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value || value.trim().length === 0) throw new Error(`${field} is required`);
    return value.trim();
  }

  static create(props: TeacherProps): TeacherEntity {
    return new TeacherEntity(props);
  }

  

  assignToDepartment(deptId: string): void {
    this._deptId = deptId;
    this._updatedAt = new Date();
  }

  updatePassword(newHash: string): void {
    this._passwordHash = newHash;
    this._updatedAt = new Date();
  }

  // Called when teacher sets password for the first time using the setup link
  completFirstTimeSetup(passwordHash: string): void {
    this._passwordHash = passwordHash;
    this._isFirstTime = false;
    this._isVerified = true;
    this._updatedAt = new Date();
  }

  // Record last login timestamp
  recordLogin(): void {
    this._lastLogin = new Date();
    this._updatedAt = new Date();
  }

  assignSubjects(subjectIds: string[]): void {
    this._subjectIds = subjectIds
    this._updatedAt = new Date()
  }

  setLevel(level: TeacherLevel): void {
    this._level = level
    this._updatedAt = new Date()
  }

  updateProfile(updates: Partial<Pick<TeacherProps,
    | 'firstName' | 'lastName' | 'phone' | 'address'
    | 'qualification' | 'designation' | 'dob' | 'gender'
    | 'level' | 'subjectIds'
  >>): void {
    if (updates.firstName) this._firstName = updates.firstName
    if (updates.lastName) this._lastName = updates.lastName
    if (updates.phone) this._phone = updates.phone
    if (updates.address) this._address = updates.address
    if (updates.qualification) this._qualification = updates.qualification
    if (updates.designation) this._designation = updates.designation
    if (updates.dob) this._dob = updates.dob
    if (updates.gender) this._gender = updates.gender
    if (updates.level) this._level = updates.level
    if (updates.subjectIds) this._subjectIds = updates.subjectIds
    this._updatedAt = new Date()
  }


  deactivate(): void { this._isActive = false; this._updatedAt = new Date(); }
  activate(): void { this._isActive = true; this._updatedAt = new Date(); }

  // ── Getters ──────────────────────────────────────────
  get id(): string | undefined { return this._id; }
  get email(): string { return this._email.value; }
  get level(): TeacherLevel | undefined { return this._level }
  get subjectIds(): string[] { return this._subjectIds }
  get passwordHash(): string | undefined { return this._passwordHash; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get dob(): string | undefined { return this._dob; }
  get gender(): Gender | undefined { return this._gender; }
  get phone(): string | undefined { return this._phone; }
  get address(): string | undefined { return this._address; }
  get hireDate(): string | undefined { return this._hireDate; }
  get qualification(): string | undefined { return this._qualification; }
  get designation(): string | undefined { return this._designation; }
  get deptId(): string | undefined { return this._deptId; }
  get isActive(): boolean { return this._isActive; }
  get isVerified(): boolean { return this._isVerified; }
  get isFirstTime(): boolean { return this._isFirstTime; }
  get lastLogin(): Date | undefined { return this._lastLogin; }
  get createdBy(): string | undefined { return this._createdBy; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}