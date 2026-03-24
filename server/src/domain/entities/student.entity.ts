import { Email } from '../value-objects/email.value-object';
import { Gender } from '../enums';

export interface StudentProps {
  id?:               string;
  email:             string;
  passwordHash?:     string;      // optional — not set until first-time setup
  firstName:         string;
  lastName:          string;
  dob?:              string;
  gender?:           Gender;
  phone?:            string;
  address?:          string;
  admissionDate?:    string;
  guardianName?:     string;
  guardianContact?:  string;
  classId?:          string;
  isActive?:         boolean;
  isVerified?:       boolean;     // ← added
  isFirstTime?:      boolean;     // ← added
  passwordResetBy?:  string;      // ← added (FK > manager.id)
  passwordResetAt?:  Date;        // ← added
  lastLogin?:        Date;        // ← added
  createdBy?:        string;      // ← added (FK > manager.id)
  createdAt?:        Date;
  updatedAt?:        Date;
}

export class StudentEntity {
  private readonly _id?:    string;
  private _email:           Email;
  private _passwordHash?:   string;
  private _firstName:       string;
  private _lastName:        string;
  private _dob?:            string;
  private _gender?:         Gender;
  private _phone?:          string;
  private _address?:        string;
  private _admissionDate?:  string;
  private _guardianName?:   string;
  private _guardianContact?: string;
  private _classId?:        string;
  private _isActive:        boolean;
  private _isVerified:      boolean;      // ← added
  private _isFirstTime:     boolean;      // ← added
  private _passwordResetBy?: string;      // ← added
  private _passwordResetAt?: Date;        // ← added
  private _lastLogin?:      Date;         // ← added
  private _createdBy?:      string;       // ← added
  private readonly _createdAt: Date;
  private _updatedAt:       Date;

  private constructor(props: StudentProps) {
    this._id              = props.id;
    this._email           = Email.create(props.email);
    this._passwordHash    = props.passwordHash;
    this._firstName       = this.requireNonEmpty(props.firstName, 'firstName');
    this._lastName        = this.requireNonEmpty(props.lastName,  'lastName');
    this._dob             = props.dob;
    this._gender          = props.gender;
    this._phone           = props.phone;
    this._address         = props.address;
    this._admissionDate   = props.admissionDate;
    this._guardianName    = props.guardianName;
    this._guardianContact = props.guardianContact;
    this._classId         = props.classId;
    this._isActive        = props.isActive     ?? true;
    this._isVerified      = props.isVerified   ?? false;    // ← added
    this._isFirstTime     = props.isFirstTime  ?? true;     // ← added
    this._passwordResetBy = props.passwordResetBy;          // ← added
    this._passwordResetAt = props.passwordResetAt;          // ← added
    this._lastLogin       = props.lastLogin;                // ← added
    this._createdBy       = props.createdBy;                // ← added
    this._createdAt       = props.createdAt    ?? new Date();
    this._updatedAt       = props.updatedAt    ?? new Date();
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value || value.trim().length === 0) throw new Error(`${field} is required`);
    return value.trim();
  }

  static create(props: StudentProps): StudentEntity {
    return new StudentEntity(props);
  }

  // ── Domain behaviours ────────────────────────────────

  updateProfile(updates: Partial<Pick<StudentProps,
    'firstName' | 'lastName' | 'phone' | 'address' | 'dob' |
    'gender' | 'guardianName' | 'guardianContact'
  >>): void {
    if (updates.firstName)                      this._firstName       = updates.firstName.trim();
    if (updates.lastName)                       this._lastName        = updates.lastName.trim();
    if (updates.phone           !== undefined)  this._phone           = updates.phone;
    if (updates.address         !== undefined)  this._address         = updates.address;
    if (updates.dob             !== undefined)  this._dob             = updates.dob;
    if (updates.gender          !== undefined)  this._gender          = updates.gender;
    if (updates.guardianName    !== undefined)  this._guardianName    = updates.guardianName;
    if (updates.guardianContact !== undefined)  this._guardianContact = updates.guardianContact;
    this._updatedAt = new Date();
  }

  // assignToClass(classId: string): void {
  //   this._classId   = classId;
  //   this._updatedAt = new Date();
  // }

  updatePassword(newHash: string): void {
    this._passwordHash = newHash;
    this._updatedAt    = new Date();
  }

  // Called when manager/teacher resets the student's password
  // Forces the student to set a new password on next login
  setPasswordResetBy(managerId: string): void {
    this._passwordResetBy = managerId;
    this._passwordResetAt = new Date();
    this._updatedAt       = new Date();
  }

  // Force first-time setup flag back to true
  // Used after a password reset so student must change it on login
  markAsFirstTime(): void {
    this._isFirstTime = true;
    this._updatedAt   = new Date();
  }

  // Called when student sets password for the first time using the setup link
  completFirstTimeSetup(passwordHash: string): void {
    this._passwordHash = passwordHash;
    this._isFirstTime  = false;
    this._isVerified   = true;
    this._updatedAt    = new Date();
  }

  // Record last login timestamp
  recordLogin(): void {
    this._lastLogin = new Date();
    this._updatedAt = new Date();
  }

  deactivate(): void { this._isActive = false; this._updatedAt = new Date(); }
  activate():   void { this._isActive = true;  this._updatedAt = new Date(); }

  // ── Getters ──────────────────────────────────────────
  get id():               string | undefined  { return this._id; }
  get email():            string              { return this._email.value; }
  get passwordHash():     string | undefined  { return this._passwordHash; }
  get firstName():        string              { return this._firstName; }
  get lastName():         string              { return this._lastName; }
  get fullName():         string              { return `${this._firstName} ${this._lastName}`; }
  get dob():              string | undefined  { return this._dob; }
  get gender():           Gender | undefined  { return this._gender; }
  get phone():            string | undefined  { return this._phone; }
  get address():          string | undefined  { return this._address; }
  get admissionDate():    string | undefined  { return this._admissionDate; }
  get guardianName():     string | undefined  { return this._guardianName; }
  get guardianContact():  string | undefined  { return this._guardianContact; }
  get classId():          string | undefined  { return this._classId; }
  get isActive():         boolean             { return this._isActive; }
  get isVerified():       boolean             { return this._isVerified; }
  get isFirstTime():      boolean             { return this._isFirstTime; }
  get passwordResetBy():  string | undefined  { return this._passwordResetBy; }
  get passwordResetAt():  Date | undefined    { return this._passwordResetAt; }
  get lastLogin():        Date | undefined    { return this._lastLogin; }
  get createdBy():        string | undefined  { return this._createdBy; }
  get createdAt():        Date                { return this._createdAt; }
  get updatedAt():        Date                { return this._updatedAt; }
}