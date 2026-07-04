import { BaseEntity } from '../interfaces/repository.interface';
export interface IRentalTenantDocument {
    id: string;
    type: 'application' | 'lease_agreement' | 'lease_modification' | 'other';
    originalName: string;
    fileName: string;
    url: string;
    uploadedAt: Date;
}
export interface IRentalTenant {
    id: string;
    name: string;
    phoneNumber: string;
    startDate: Date;
    endDate?: Date;
    status: 'current' | 'past';
    documents?: IRentalTenantDocument[];
}
export interface IRental extends BaseEntity {
    title: string;
    description: string;
    price: number;
    location: string;
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    amenities?: string[];
    images?: string[];
    ownerId: string;
    isAvailable: boolean;
    availableFrom?: Date;
    leaseDuration?: number;
    petPolicy?: 'allowed' | 'not-allowed' | 'deposit-required';
    utilities?: {
        electricity: boolean;
        water: boolean;
        gas: boolean;
        internet: boolean;
        cable: boolean;
    };
    currentRenterIds?: string[];
    leaseInfo?: {
        startDate: Date;
        endDate: Date;
        monthlyRent: number;
        securityDeposit: number;
        leaseTerms?: string;
    };
    tenants?: IRentalTenant[];
}
export declare class Rental implements IRental {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    amenities?: string[];
    images?: string[];
    ownerId: string;
    isAvailable: boolean;
    availableFrom?: Date;
    leaseDuration?: number;
    petPolicy?: 'allowed' | 'not-allowed' | 'deposit-required';
    utilities?: {
        electricity: boolean;
        water: boolean;
        gas: boolean;
        internet: boolean;
        cable: boolean;
    };
    tenants?: IRentalTenant[];
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>);
    private generateId;
    updateTimestamp(): void;
    toJSON(): IRental;
}
//# sourceMappingURL=rental.model.d.ts.map