import { BaseEntity } from '../interfaces/repository.interface';
export type RenterStatus = 'prospective' | 'current' | 'past' | 'blacklisted';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'self-employed' | 'unemployed' | 'student' | 'retired';
export interface EmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
}
export interface Employment {
    employerName: string;
    position: string;
    type: EmploymentType;
    monthlyIncome: number;
    startDate: Date;
    endDate?: Date;
    contactPerson?: string;
    contactPhone?: string;
    isCurrentJob: boolean;
}
export interface Reference {
    name: string;
    relationship: 'previous_landlord' | 'employer' | 'personal' | 'professional';
    phoneNumber: string;
    email?: string;
    address?: string;
    yearsKnown: number;
}
export interface RentalHistory {
    address: string;
    landlordName: string;
    landlordPhone: string;
    landlordEmail?: string;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    reasonForLeaving?: string;
    reference: 'positive' | 'neutral' | 'negative' | 'not-contacted';
    notes?: string;
}
export interface CreditInfo {
    creditScore?: number;
    creditScoreDate?: Date;
    hasDeclarations: boolean;
    bankruptcyHistory: boolean;
    evictionHistory: boolean;
    criminalBackground: boolean;
    notes?: string;
}
export interface IRenter extends BaseEntity {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phoneNumber: string;
    alternatePhone?: string;
    currentAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    driversLicenseNumber?: string;
    socialSecurityNumber?: string;
    status: RenterStatus;
    applicationStatus: ApplicationStatus;
    applicationDate?: Date;
    moveInDate?: Date;
    moveOutDate?: Date;
    currentEmployment?: Employment;
    previousEmployments?: Employment[];
    otherIncomeSource?: string;
    totalMonthlyIncome: number;
    emergencyContacts: EmergencyContact[];
    references: Reference[];
    rentalHistory: RentalHistory[];
    creditInfo: CreditInfo;
    preferences?: {
        maxRent: number;
        preferredMoveInDate?: Date;
        leaseDuration: number;
        petOwner: boolean;
        smokingStatus: 'non-smoker' | 'smoker' | 'occasional';
        specialRequests?: string;
    };
    currentRentalId?: string;
    leaseStartDate?: Date;
    leaseEndDate?: Date;
    monthlyRent?: number;
    securityDeposit?: number;
    documents?: {
        type: 'id' | 'income_proof' | 'reference_letter' | 'credit_report' | 'other';
        filename: string;
        uploadDate: Date;
    }[];
    notes?: string;
    internalNotes?: string;
    preferredContactMethod: 'email' | 'phone' | 'text';
    communicationHistory?: {
        date: Date;
        type: 'email' | 'phone' | 'in-person' | 'text';
        summary: string;
        followUpRequired: boolean;
    }[];
}
export declare class Renter implements IRenter {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phoneNumber: string;
    alternatePhone?: string;
    currentAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    driversLicenseNumber?: string;
    socialSecurityNumber?: string;
    status: RenterStatus;
    applicationStatus: ApplicationStatus;
    applicationDate?: Date;
    moveInDate?: Date;
    moveOutDate?: Date;
    currentEmployment?: Employment;
    previousEmployments?: Employment[];
    otherIncomeSource?: string;
    totalMonthlyIncome: number;
    emergencyContacts: EmergencyContact[];
    references: Reference[];
    rentalHistory: RentalHistory[];
    creditInfo: CreditInfo;
    preferences?: {
        maxRent: number;
        preferredMoveInDate?: Date;
        leaseDuration: number;
        petOwner: boolean;
        smokingStatus: 'non-smoker' | 'smoker' | 'occasional';
        specialRequests?: string;
    };
    currentRentalId?: string;
    leaseStartDate?: Date;
    leaseEndDate?: Date;
    monthlyRent?: number;
    securityDeposit?: number;
    documents?: {
        type: 'id' | 'income_proof' | 'reference_letter' | 'credit_report' | 'other';
        filename: string;
        uploadDate: Date;
    }[];
    notes?: string;
    internalNotes?: string;
    preferredContactMethod: 'email' | 'phone' | 'text';
    communicationHistory?: {
        date: Date;
        type: 'email' | 'phone' | 'in-person' | 'text';
        summary: string;
        followUpRequired: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>);
    private generateId;
    updateTimestamp(): void;
    getFullName(): string;
    getAge(): number;
    addEmergencyContact(contact: EmergencyContact): void;
    addReference(reference: Reference): void;
    addCommunicationRecord(record: {
        type: 'email' | 'phone' | 'in-person' | 'text';
        summary: string;
        followUpRequired?: boolean;
    }): void;
    assignToRental(rentalId: string, leaseStart: Date, leaseEnd: Date, monthlyRent: number, securityDeposit?: number): void;
    endLease(moveOutDate: Date): void;
    calculateIncomeToRentRatio(): number;
    isQualified(minIncomeRatio?: number): {
        qualified: boolean;
        reasons: string[];
    };
    toJSON(): IRenter;
}
//# sourceMappingURL=renter.model.d.ts.map