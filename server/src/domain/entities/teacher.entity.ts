import { Email } from "../value-objects/email.value-object";
import { Gender } from "../enums";

export interface TeacherProps {
    id?: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    dob?: string;
    gender?: Gender;
    phone?: string;
    address?: string;
    hireDate?: string;
    qualification?: string;
    designation?: string;
    deptId?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class TeacherEntity {
    private readonly _id?: string;
    private _email: Email;
    private _passwordHash: string;
    private _firstName: string;
    private _lastName: string;
    private _dob?: string;
    private _gender?: Gender;
    private _phone?: string;
    private _address?: string;
    private _hireDate?: string;
    private _qualification?: string;
    private _designation?: string;
    private _deptId?: string;
    private _isActive: boolean;
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
        this._phone = props.phone;
        this._address = props.address;
        this._hireDate = props.hireDate;
        this._qualification = props.qualification;
        this._designation = props.designation;
        this._deptId = props.deptId;
        this._isActive = props.isActive ?? true;
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


    // ── Domain behaviours ──────────────────────────────────
    updateProfile(updates: Partial<Pick<TeacherProps,
        'firstName' | 'lastName' | 'phone' | 'address' | 'dob' | 'gender' | 'qualification' | 'designation'
    >>): void {
        if (updates.firstName) this._firstName = updates.firstName.trim();
        if (updates.lastName) this._lastName = updates.lastName.trim();
        if (updates.phone !== undefined) this._phone = updates.phone;
        if (updates.address !== undefined) this._address = updates.address;
        if (updates.dob !== undefined) this._dob = updates.dob;
        if (updates.gender !== undefined) this._gender = updates.gender;
        if (updates.qualification) this._qualification = updates.qualification;
        if (updates.designation) this._designation = updates.designation;
        this._updatedAt = new Date();
    }

    assignToDepartment(deptId: string): void {
        this._deptId = deptId;
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
    get dob(): string | undefined { return this._dob; }
    get gender(): Gender | undefined { return this._gender; }
    get phone(): string | undefined { return this._phone; }
    get address(): string | undefined { return this._address; }
    get hireDate(): string | undefined { return this._hireDate; }
    get qualification(): string | undefined { return this._qualification; }
    get designation(): string | undefined { return this._designation; }
    get deptId(): string | undefined { return this._deptId; }
    get isActive(): boolean { return this._isActive; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }




}