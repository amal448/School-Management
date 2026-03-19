// src/domain/entities/admin.entity.ts
import { Email } from 'src/domain/value-objects/email.value-object'

export interface AdminProps {
  id?:           string
  googleId?:     string
  email:         string
  passwordHash?: string
  firstName:     string
  lastName:      string
  avatar?:       string
  isActive?:     boolean
  isVerified?:   boolean
  lastLogin?:    Date
  createdAt?:    Date
  updatedAt?:    Date
}

export class AdminEntity {
  private readonly _id?:    string
  private _googleId?:       string
  private _email:           Email
  private _firstName:       string
  private _lastName:        string
  private _avatar?:         string
  private _isActive:        boolean
  private _isVerified:      boolean
  private _lastLogin?:      Date
  private readonly _createdAt: Date
  private _updatedAt:       Date

  private constructor(props: AdminProps) {
    this._id           = props.id
    this._googleId     = props.googleId
    this._email        = Email.create(props.email)
    this._firstName    = this.requireNonEmpty(props.firstName, 'firstName')
    this._lastName     = this.requireNonEmpty(props.lastName,  'lastName')
    this._avatar       = props.avatar
    this._isActive     = props.isActive   ?? true
    this._isVerified   = props.isVerified ?? false
    this._lastLogin    = props.lastLogin
    this._createdAt    = props.createdAt  ?? new Date()
    this._updatedAt    = props.updatedAt  ?? new Date()
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value?.trim()) throw new Error(`${field} is required`)
    return value.trim()
  }

  static create(props: AdminProps): AdminEntity {
    return new AdminEntity(props)
  }

  // ── Domain behaviours ──────────────────────────────
  updateFromGoogle(data: { firstName: string; lastName: string; avatar?: string }): void {
    this._firstName = data.firstName
    this._lastName  = data.lastName
    this._avatar    = data.avatar
    this._updatedAt = new Date()
  }

  markVerified(): void {
    this._isVerified = true
    this._updatedAt  = new Date()
  }

  recordLogin(): void {
    this._lastLogin = new Date()
    this._updatedAt = new Date()
  }



  deactivate(): void { this._isActive = false; this._updatedAt = new Date() }
  activate():   void { this._isActive = true;  this._updatedAt = new Date() }

  // ── Getters ────────────────────────────────────────
  get id():           string | undefined  { return this._id }
  get googleId():     string | undefined  { return this._googleId }
  get email():        string              { return this._email.value }
  get firstName():    string              { return this._firstName }
  get lastName():     string              { return this._lastName }
  get fullName():     string              { return `${this._firstName} ${this._lastName}` }
  get avatar():       string | undefined  { return this._avatar }
  get isActive():     boolean             { return this._isActive }
  get isVerified():   boolean             { return this._isVerified }
  get lastLogin():    Date | undefined    { return this._lastLogin }
  get createdAt():    Date                { return this._createdAt }
  get updatedAt():    Date                { return this._updatedAt }
}