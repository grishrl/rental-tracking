import { IRenter, RenterStatus, ApplicationStatus } from '../models/renter.model';
import { IRenterRepository } from '../repositories/renter.repository.interface';
import { IRentalRepository } from '../repositories/rental.repository.interface';
export interface RenterSummary {
    totalRenters: number;
    currentRenters: number;
    prospectiveRenters: number;
    pastRenters: number;
    pendingApplications: number;
    approvedApplications: number;
    leasesExpiringThisMonth: number;
    followUpRequired: number;
}
export interface ApplicationDecision {
    approved: boolean;
    reasons: string[];
    conditions?: string[];
    requiredDocuments?: string[];
}
export declare class RenterService {
    private renterRepository;
    private rentalRepository;
    constructor(renterRepository: IRenterRepository, rentalRepository: IRentalRepository);
    createRenter(renterData: Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRenter>;
    updateRenter(id: string, updates: Partial<Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IRenter | null>;
    deleteRenter(id: string): Promise<boolean>;
    getRenterById(id: string): Promise<IRenter | null>;
    getRenterByEmail(email: string): Promise<IRenter | null>;
    getAllRenters(): Promise<IRenter[]>;
    getRentersByStatus(status: RenterStatus): Promise<IRenter[]>;
    getRentersByApplicationStatus(status: ApplicationStatus): Promise<IRenter[]>;
    getCurrentRenters(): Promise<IRenter[]>;
    getProspectiveRenters(): Promise<IRenter[]>;
    getRentersForRental(rentalId: string): Promise<IRenter[]>;
    assignRenterToRental(renterId: string, rentalId: string, leaseDetails: {
        startDate: Date;
        endDate: Date;
        monthlyRent: number;
        securityDeposit?: number;
    }): Promise<{
        renter: IRenter;
        rental: any;
    }>;
    endLease(renterId: string, moveOutDate: Date): Promise<{
        renter: IRenter;
        rental: any;
    }>;
    processApplication(renterId: string, decision: 'approve' | 'reject', notes?: string): Promise<IRenter>;
    evaluateApplication(renterId: string, minIncomeRatio?: number): Promise<ApplicationDecision>;
    addCommunicationRecord(renterId: string, record: {
        type: 'email' | 'phone' | 'in-person' | 'text';
        summary: string;
        followUpRequired?: boolean;
    }): Promise<IRenter>;
    getLeasesExpiring(daysFromNow: number): Promise<IRenter[]>;
    getRentersRequiringFollowUp(): Promise<IRenter[]>;
    searchRenters(query: {
        name?: string;
        email?: string;
        phoneNumber?: string;
        status?: RenterStatus;
        applicationStatus?: ApplicationStatus;
        rentalId?: string;
    }): Promise<IRenter[]>;
    getRenterSummary(): Promise<RenterSummary>;
    private validateRenterData;
    private isValidEmail;
    private calculateAge;
}
//# sourceMappingURL=renter.service.d.ts.map