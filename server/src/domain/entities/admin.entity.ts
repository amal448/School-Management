// src/domain/entities/admin.entity.ts

import { Email } from "../value-objects/email.value-object";

export interface AdminProps {
  id?: string;
  googleId: string;         // OAuth subject identifier
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;          // profile picture from Google
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AdminEntity {
  private readonly _id?: string;
  private readonly _googleId: string;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _avatar?: string;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AdminProps) {
    this._id        = props.id;
    this._googleId  = props.googleId;
    this._email     = Email.create(props.email);
    this._firstName = props.firstName;
    this._lastName  = props.lastName;
    this._avatar    = props.avatar;
    this._isActive  = props.isActive ?? true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: AdminProps): AdminEntity {
    if (!props.googleId) throw new Error('googleId is required');
    return new AdminEntity(props);
  }

  updateFromGoogle(data: { firstName: string; lastName: string; avatar?: string }): void {
    this._firstName = data.firstName;
    this._lastName  = data.lastName;
    this._avatar    = data.avatar;
    this._updatedAt = new Date();
  }

  get id(): string | undefined      { return this._id; }
  get googleId(): string             { return this._googleId; }
  get email(): string                { return this._email.value; }
  get firstName(): string            { return this._firstName; }
  get lastName(): string             { return this._lastName; }
  get fullName(): string             { return `${this._firstName} ${this._lastName}`; }
  get avatar(): string | undefined   { return this._avatar; }
  get isActive(): boolean            { return this._isActive; }
  get createdAt(): Date              { return this._createdAt; }
  get updatedAt(): Date              { return this._updatedAt; }
}