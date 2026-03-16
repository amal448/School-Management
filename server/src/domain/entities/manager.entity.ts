import { Email } from "../value-objects/email.value-object";

export interface ManagerProps {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ManagerEntity {
    private readonly _id?: string;
    private _email: Email;
    private _passwordHash: string;
    private _firstName: string;
    private _lastName: string;
    private _phone?: string;
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: ManagerProps) {
        this._id = props.id;
        this._email = Email.create(props.email);
        this._passwordHash = props.passwordHash;
        this._firstName = this.requireNonEmpty(props.firstName, 'firstName');
        this._lastName = this.requireNonEmpty(props.lastName, 'lastName');
        this._phone = props.phone;
        this._isActive = props.isActive ?? true;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }

    private requireNonEmpty(value: string, field: string): string {
        if (!value || value.trim().length === 0) throw new Error(`${field} is required`);
        return value.trim();
    }

    static create(props: ManagerProps): ManagerEntity {
        return new ManagerEntity(props);
    }


    // ── Domain behaviours ──────────────────────────────────

    updateProfile(updates: { firstName?: string; lastName?: string; phone?: string }): void {
        if (updates.firstName) this._firstName = updates.firstName.trim();
        if (updates.lastName) this._lastName = updates.lastName.trim();
        if (updates.phone !== undefined) this._phone = updates.phone;
        this._updatedAt = new Date();
    }

    updatePassword(newHash: string): void {
        this._passwordHash = newHash;
        this._updatedAt = new Date();
    }

    deactivate(): void { this._isActive = false; this._updatedAt = new Date(); }
    activate(): void { this._isActive = true; this._updatedAt = new Date(); }


    // ── Getters ────────────────────────────────────────────
    get id(): string | undefined { return this._id; }
    get email(): string { return this._email.value; }
    get passwordHash(): string { return this._passwordHash; }
    get firstName(): string { return this._firstName; }
    get lastName(): string { return this._lastName; }
    get fullName(): string { return `${this._firstName} ${this._lastName}`; }
    get phone(): string | undefined { return this._phone; }
    get isActive(): boolean { return this._isActive; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
}

