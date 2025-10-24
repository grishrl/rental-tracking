import { IRenter, RenterStatus, ApplicationStatus } from '../models/renter.model';
import { InMemoryRepository } from './memory.repository';
import { IRenterRepository } from './renter.repository.interface';
export declare class RenterRepository extends InMemoryRepository<IRenter> implements IRenterRepository {
    constructor();
    findByStatus(status: RenterStatus): Promise<IRenter[]>;
    findByApplicationStatus(status: ApplicationStatus): Promise<IRenter[]>;
    findByRental(rentalId: string): Promise<IRenter[]>;
    findByEmail(email: string): Promise<IRenter | null>;
    findByName(firstName: string, lastName: string): Promise<IRenter[]>;
    findCurrentRenters(): Promise<IRenter[]>;
    findProspectiveRenters(): Promise<IRenter[]>;
    findPastRenters(): Promise<IRenter[]>;
    findRentersWithLeaseExpiring(daysFromNow: number): Promise<IRenter[]>;
    findRentersRequiringFollowUp(): Promise<IRenter[]>;
    searchRenters(query: {
        name?: string;
        email?: string;
        phoneNumber?: string;
        status?: RenterStatus;
        applicationStatus?: ApplicationStatus;
        rentalId?: string;
    }): Promise<IRenter[]>;
}
//# sourceMappingURL=renter.repository.d.ts.map