// ─────────────────────────────────────────────
// src/domain/entities/user.entity.ts
// ─────────────────────────────────────────────
// The User entity is the heart of the domain.
// It encapsulates all business rules via private fields
// and exposes controlled access through getters.
// Following SRP: only concerned with user identity/state.

import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.value-object';

// Role-specific profile data (separate from core identity)
export interface TeacherProfile {
  deptId?: string;
  hireDate?: string;
  qualification?: string;
}

export interface StudentProfile {
  classId?: string;
  admissionDate?: string;
  guardianName?: string;
}

export interface UserProps {
  id?: string;
  email: string;
  passwordHash: string;
  role: Role;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: string;
  phone?: string;
  address?: string;
  teacherProfile?: TeacherProfile;
  studentProfile?: StudentProfile;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  private readonly _id?: string;
  private _email: Email;
  private _passwordHash: string;
  private readonly _role: Role;
  private _firstName: string;
  private _lastName: string;
  private _dob?: string;
  private _gender?: string;
  private _phone?: string;
  private _address?: string;
  private _teacherProfile?: TeacherProfile;
  private _studentProfile?: StudentProfile;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._email = Email.create(props.email);
    this._passwordHash = props.passwordHash;
    this._role = props.role;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._dob = props.dob;
    this._gender = props.gender;
    this._phone = props.phone;
    this._address = props.address;
    this._teacherProfile = props.teacherProfile;
    this._studentProfile = props.studentProfile;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  // ── Factory method: enforces valid creation ─────────────
  static create(props: UserProps): UserEntity {
    if (!props.firstName || props.firstName.trim().length < 1) {
      throw new Error('First name is required');
    }
    if (!props.lastName || props.lastName.trim().length < 1) {
      throw new Error('Last name is required');
    }
    if (!Object.values(Role).includes(props.role)) {
      throw new Error(`Invalid role: ${props.role}`);
    }
    return new UserEntity(props);
  }

  // ── Domain behaviour: updating profile ──────────────────
  updateProfile(updates: Partial<Pick<UserProps, 'firstName' | 'lastName' | 'phone' | 'address' | 'dob' | 'gender'>>): void {
    if (updates.firstName) this._firstName = updates.firstName;
    if (updates.lastName) this._lastName = updates.lastName;
    if (updates.phone !== undefined) this._phone = updates.phone;
    if (updates.address !== undefined) this._address = updates.address;
    if (updates.dob !== undefined) this._dob = updates.dob;
    if (updates.gender !== undefined) this._gender = updates.gender;
    this._updatedAt = new Date();
  }

  updatePassword(newHash: string): void {
    this._passwordHash = newHash;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  isTeacher(): boolean {
    return this._role === Role.TEACHER;
  }

  isStudent(): boolean {
    return this._role === Role.STUDENT;
  }

  isManager(): boolean {
    return this._role === Role.MANAGER;
  }

  // ── Getters ────────────────────────────────────────────
  get id(): string | undefined { return this._id; }
  get email(): string { return this._email.value; }
  get passwordHash(): string { return this._passwordHash; }
  get role(): Role { return this._role; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get dob(): string | undefined { return this._dob; }
  get gender(): string | undefined { return this._gender; }
  get phone(): string | undefined { return this._phone; }
  get address(): string | undefined { return this._address; }
  get teacherProfile(): TeacherProfile | undefined { return this._teacherProfile; }
  get studentProfile(): StudentProfile | undefined { return this._studentProfile; }
  get isActive(): boolean { return this._isActive; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}
