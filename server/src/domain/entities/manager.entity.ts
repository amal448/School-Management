// src/domain/entities/manager.entity.ts
import { Email } from 'src/domain/value-objects/email.value-object'

export interface ManagerProps {
  id?:            string
  email:          string
  passwordHash?:  string
  firstName:      string
  lastName:       string
  phone?:         string
  isActive?:      boolean
  isVerified?:    boolean
  isFirstTime?:   boolean
  isBlocked?:     boolean
  blockedBy?:     string
  blockedAt?:     Date
  lastLogin?:     Date
  createdByAdmin: string
  createdAt?:     Date
  updatedAt?:     Date
}

export class ManagerEntity {
  private readonly _id?:            string
  private _email:                   Email
  private _passwordHash?:           string
  private _firstName:               string
  private _lastName:                string
  private _phone?:                  string
  private _isActive:                boolean
  private _isVerified:              boolean
  private _isFirstTime:             boolean
  private _isBlocked:               boolean
  private _blockedBy?:              string
  private _blockedAt?:              Date
  private _lastLogin?:              Date
  private readonly _createdByAdmin: string
  private readonly _createdAt:      Date
  private _updatedAt:               Date

  private constructor(props: ManagerProps) {
    if (!props.createdByAdmin) throw new Error('createdByAdmin is required')
    this._id             = props.id
    this._email          = Email.create(props.email)
    this._passwordHash   = props.passwordHash
    this._firstName      = this.requireNonEmpty(props.firstName, 'firstName')
    this._lastName       = this.requireNonEmpty(props.lastName,  'lastName')
    this._phone          = props.phone
    this._isActive       = props.isActive    ?? true
    this._isVerified     = props.isVerified  ?? false
    this._isFirstTime    = props.isFirstTime ?? true
    this._isBlocked      = props.isBlocked   ?? false
    this._blockedBy      = props.blockedBy
    this._blockedAt      = props.blockedAt
    this._lastLogin      = props.lastLogin
    this._createdByAdmin = props.createdByAdmin
    this._createdAt      = props.createdAt   ?? new Date()
    this._updatedAt      = props.updatedAt   ?? new Date()
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value?.trim()) throw new Error(`${field} is required`)
    return value.trim()
  }

  static create(props: ManagerProps): ManagerEntity {
    return new ManagerEntity(props)
  }

  // ── Domain behaviours ──────────────────────────────

  updateProfile(updates: Partial<Pick<ManagerProps,
    'firstName' | 'lastName' | 'phone'
  >>): void {
    if (updates.firstName)           this._firstName = updates.firstName.trim()
    if (updates.lastName)            this._lastName  = updates.lastName.trim()
    if (updates.phone !== undefined) this._phone     = updates.phone
    this._updatedAt = new Date()
  }

  updatePassword(newHash: string): void {
    this._passwordHash = newHash
    this._updatedAt    = new Date()
  }

  // Called when manager uses their first-time setup link
  // Sets password, marks verified, clears first-time flag
  completeFirstTimeSetup(passwordHash: string): void {
    this._passwordHash = passwordHash
    this._isFirstTime  = false
    this._isVerified   = true
    this._updatedAt    = new Date()
  }

  // Called after successful OTP verification
  recordLogin(): void {
    this._lastLogin = new Date()
    this._updatedAt = new Date()
  }

  // Admin blocks this manager
  block(blockedByAdminId: string): void {
    this._isBlocked = true
    this._blockedBy = blockedByAdminId
    this._blockedAt = new Date()
    this._updatedAt = new Date()
  }

  // Admin unblocks this manager
  unblock(): void {
    this._isBlocked = false
    this._blockedBy = undefined
    this._blockedAt = undefined
    this._updatedAt = new Date()
  }

  deactivate(): void { this._isActive = false; this._updatedAt = new Date() }
  activate():   void { this._isActive = true;  this._updatedAt = new Date() }

  // ── Getters ──────────────────────────────────────────
  get id():             string | undefined { return this._id }
  get email():          string             { return this._email.value }
  get passwordHash():   string | undefined { return this._passwordHash }
  get firstName():      string             { return this._firstName }
  get lastName():       string             { return this._lastName }
  get fullName():       string             { return `${this._firstName} ${this._lastName}` }
  get phone():          string | undefined { return this._phone }
  get isActive():       boolean            { return this._isActive }
  get isVerified():     boolean            { return this._isVerified }
  get isFirstTime():    boolean            { return this._isFirstTime }
  get isBlocked():      boolean            { return this._isBlocked }
  get blockedBy():      string | undefined { return this._blockedBy }
  get blockedAt():      Date | undefined   { return this._blockedAt }
  get lastLogin():      Date | undefined   { return this._lastLogin }
  get createdByAdmin(): string             { return this._createdByAdmin }
  get createdAt():      Date               { return this._createdAt }
  get updatedAt():      Date               { return this._updatedAt }
}