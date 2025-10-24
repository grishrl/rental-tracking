import { IRenter, RenterStatus, ApplicationStatus } from '../models/renter.model';
import { InMemoryRepository } from './memory.repository';
import { IRenterRepository } from './renter.repository.interface';

export class RenterRepository extends InMemoryRepository<IRenter> implements IRenterRepository {
  constructor() {
    super('renters');
  }

  async findByStatus(status: RenterStatus): Promise<IRenter[]> {
    return this.findBy({ status } as Partial<IRenter>);
  }

  async findByApplicationStatus(status: ApplicationStatus): Promise<IRenter[]> {
    return this.findBy({ applicationStatus: status } as Partial<IRenter>);
  }

  async findByRental(rentalId: string): Promise<IRenter[]> {
    return this.findBy({ currentRentalId: rentalId } as Partial<IRenter>);
  }

  async findByEmail(email: string): Promise<IRenter | null> {
    const renters = await this.findBy({ email } as Partial<IRenter>);
    return renters.length > 0 ? renters[0] : null;
  }

  async findByName(firstName: string, lastName: string): Promise<IRenter[]> {
    return this.findBy({ firstName, lastName } as Partial<IRenter>);
  }

  async findCurrentRenters(): Promise<IRenter[]> {
    return this.findByStatus('current');
  }

  async findProspectiveRenters(): Promise<IRenter[]> {
    return this.findByStatus('prospective');
  }

  async findPastRenters(): Promise<IRenter[]> {
    return this.findByStatus('past');
  }

  async findRentersWithLeaseExpiring(daysFromNow: number): Promise<IRenter[]> {
    const allRenters = await this.findAll();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromNow);

    return allRenters.filter(renter => 
      renter.status === 'current' &&
      renter.leaseEndDate &&
      renter.leaseEndDate <= targetDate &&
      renter.leaseEndDate >= new Date()
    );
  }

  async findRentersRequiringFollowUp(): Promise<IRenter[]> {
    const allRenters = await this.findAll();
    
    return allRenters.filter(renter => 
      renter.communicationHistory &&
      renter.communicationHistory.some(comm => comm.followUpRequired)
    );
  }

  async searchRenters(query: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    status?: RenterStatus;
    applicationStatus?: ApplicationStatus;
    rentalId?: string;
  }): Promise<IRenter[]> {
    let results = await this.findAll();

    if (query.name) {
      const nameLower = query.name.toLowerCase();
      results = results.filter(renter => 
        renter.firstName.toLowerCase().includes(nameLower) ||
        renter.lastName.toLowerCase().includes(nameLower) ||
        `${renter.firstName} ${renter.lastName}`.toLowerCase().includes(nameLower)
      );
    }

    if (query.email) {
      results = results.filter(renter => 
        renter.email.toLowerCase().includes(query.email!.toLowerCase())
      );
    }

    if (query.phoneNumber) {
      // Remove formatting for comparison
      const cleanQuery = query.phoneNumber.replace(/\D/g, '');
      results = results.filter(renter => {
        const cleanPhone = renter.phoneNumber.replace(/\D/g, '');
        const cleanAltPhone = renter.alternatePhone?.replace(/\D/g, '') || '';
        return cleanPhone.includes(cleanQuery) || cleanAltPhone.includes(cleanQuery);
      });
    }

    if (query.status) {
      results = results.filter(renter => renter.status === query.status);
    }

    if (query.applicationStatus) {
      results = results.filter(renter => renter.applicationStatus === query.applicationStatus);
    }

    if (query.rentalId) {
      results = results.filter(renter => renter.currentRentalId === query.rentalId);
    }

    return results;
  }
}