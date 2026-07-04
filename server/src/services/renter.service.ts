import { IRenter, Renter, RenterStatus, ApplicationStatus } from '../models/renter.model';
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

export interface RenterInquiryInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  preferredContactMethod?: 'email' | 'phone' | 'text';
  interestedRentalId: string;
  inquiryMessage?: string;
}

export class RenterService {
  constructor(
    private renterRepository: IRenterRepository,
    private rentalRepository: IRentalRepository
  ) {}

  async createRenter(renterData: Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRenter> {
    // Validate renter data
    await this.validateRenterData(renterData);
    
    const renter = new Renter(renterData);
    return this.renterRepository.create(renter.toJSON());
  }

  async createInquiry(input: RenterInquiryInput): Promise<IRenter> {
    if (!input.firstName?.trim()) {
      throw new Error('First name is required');
    }

    if (!input.lastName?.trim()) {
      throw new Error('Last name is required');
    }

    if (!this.isValidEmail(input.email)) {
      throw new Error('Valid email is required');
    }

    if (!input.phoneNumber?.trim()) {
      throw new Error('Phone number is required');
    }

    if (!input.interestedRentalId?.trim()) {
      throw new Error('Interested rental ID is required');
    }

    const rental = await this.rentalRepository.findById(input.interestedRentalId);
    if (!rental) {
      throw new Error('Interested rental not found');
    }

    const existingByEmail = await this.renterRepository.findByEmail(input.email);
    const communicationType: 'email' | 'phone' | 'text' = input.preferredContactMethod === 'text'
      ? 'text'
      : input.preferredContactMethod === 'phone'
        ? 'phone'
        : 'email';

    if (existingByEmail) {
      const updatedHistory = [
        ...(existingByEmail.communicationHistory || []),
        {
          date: new Date(),
          type: communicationType,
          summary: `New inquiry for rental ${rental.title} (${rental.id}). ${input.inquiryMessage || ''}`.trim(),
          followUpRequired: true,
        },
      ];

      const updated = await this.renterRepository.update(existingByEmail.id, {
        interestedRentalId: rental.id,
        inquiryMessage: input.inquiryMessage,
        leadSource: 'website',
        preferredContactMethod: input.preferredContactMethod || existingByEmail.preferredContactMethod || 'email',
        communicationHistory: updatedHistory,
        status: existingByEmail.status === 'blacklisted' ? existingByEmail.status : 'prospective',
      });

      if (!updated) {
        throw new Error('Failed to update existing renter inquiry');
      }

      return updated;
    }

    const inquiryRenter = new Renter({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
      email: input.email.trim(),
      phoneNumber: input.phoneNumber.trim(),
      currentAddress: {
        street: 'TBD',
        city: 'TBD',
        state: 'TBD',
        zipCode: '00000',
        country: 'USA',
      },
      status: 'prospective',
      applicationStatus: 'pending',
      applicationDate: new Date(),
      totalMonthlyIncome: 0,
      emergencyContacts: [],
      references: [],
      rentalHistory: [],
      creditInfo: {
        hasDeclarations: false,
        bankruptcyHistory: false,
        evictionHistory: false,
        criminalBackground: false,
      },
      preferredContactMethod: input.preferredContactMethod || 'email',
      communicationHistory: [
        {
          date: new Date(),
          type: communicationType,
          summary: `Initial inquiry for rental ${rental.title} (${rental.id}). ${input.inquiryMessage || ''}`.trim(),
          followUpRequired: true,
        },
      ],
      interestedRentalId: rental.id,
      inquiryMessage: input.inquiryMessage,
      leadSource: 'website',
      notes: `Prospective renter inquiry submitted for rental ${rental.title} (${rental.id}).`,
    });

    return this.renterRepository.create(inquiryRenter.toJSON());
  }

  async updateRenter(id: string, updates: Partial<Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IRenter | null> {
    const existingRenter = await this.renterRepository.findById(id);
    if (!existingRenter) {
      throw new Error(`Renter with id ${id} not found`);
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== existingRenter.email) {
      const existingEmailRenter = await this.renterRepository.findByEmail(updates.email);
      if (existingEmailRenter && existingEmailRenter.id !== id) {
        throw new Error('Email already exists');
      }
    }

    return this.renterRepository.update(id, updates);
  }

  async deleteRenter(id: string): Promise<boolean> {
    const existingRenter = await this.renterRepository.findById(id);
    if (!existingRenter) {
      throw new Error(`Renter with id ${id} not found`);
    }

    // Don't allow deletion of current renters
    if (existingRenter.status === 'current') {
      throw new Error('Cannot delete current renter. End lease first.');
    }

    return this.renterRepository.delete(id);
  }

  async getRenterById(id: string): Promise<IRenter | null> {
    return this.renterRepository.findById(id);
  }

  async getRenterByEmail(email: string): Promise<IRenter | null> {
    return this.renterRepository.findByEmail(email);
  }

  async getAllRenters(): Promise<IRenter[]> {
    return this.renterRepository.findAll();
  }

  async getRentersByStatus(status: RenterStatus): Promise<IRenter[]> {
    return this.renterRepository.findByStatus(status);
  }

  async getRentersByApplicationStatus(status: ApplicationStatus): Promise<IRenter[]> {
    return this.renterRepository.findByApplicationStatus(status);
  }

  async getCurrentRenters(): Promise<IRenter[]> {
    return this.renterRepository.findCurrentRenters();
  }

  async getProspectiveRenters(): Promise<IRenter[]> {
    return this.renterRepository.findProspectiveRenters();
  }

  async getRentersForRental(rentalId: string): Promise<IRenter[]> {
    return this.renterRepository.findByRental(rentalId);
  }

  async assignRenterToRental(
    renterId: string, 
    rentalId: string, 
    leaseDetails: {
      startDate: Date;
      endDate: Date;
      monthlyRent: number;
      securityDeposit?: number;
    }
  ): Promise<{ renter: IRenter; rental: any }> {
    const renter = await this.renterRepository.findById(renterId);
    if (!renter) {
      throw new Error(`Renter with id ${renterId} not found`);
    }

    const rental = await this.rentalRepository.findById(rentalId);
    if (!rental) {
      throw new Error(`Rental with id ${rentalId} not found`);
    }

    if (!rental.isAvailable) {
      throw new Error('Rental is not available');
    }

    // Update renter
    const updatedRenter = await this.renterRepository.update(renterId, {
      currentRentalId: rentalId,
      leaseStartDate: leaseDetails.startDate,
      leaseEndDate: leaseDetails.endDate,
      monthlyRent: leaseDetails.monthlyRent,
      securityDeposit: leaseDetails.securityDeposit,
      status: 'current',
      applicationStatus: 'approved',
      moveInDate: leaseDetails.startDate
    });

    // Update rental availability
    const updatedRental = await this.rentalRepository.update(rentalId, {
      isAvailable: false
    });

    return { renter: updatedRenter!, rental: updatedRental };
  }

  async endLease(renterId: string, moveOutDate: Date): Promise<{ renter: IRenter; rental: any }> {
    const renter = await this.renterRepository.findById(renterId);
    if (!renter) {
      throw new Error(`Renter with id ${renterId} not found`);
    }

    if (renter.status !== 'current' || !renter.currentRentalId) {
      throw new Error('Renter is not currently leasing a property');
    }

    // Update renter status
    const updatedRenter = await this.renterRepository.update(renterId, {
      status: 'past',
      moveOutDate: moveOutDate,
      currentRentalId: undefined
    });

    // Make rental available again
    const updatedRental = await this.rentalRepository.update(renter.currentRentalId, {
      isAvailable: true
    });

    return { renter: updatedRenter!, rental: updatedRental };
  }

  async processApplication(renterId: string, decision: 'approve' | 'reject', notes?: string): Promise<IRenter> {
    const renter = await this.renterRepository.findById(renterId);
    if (!renter) {
      throw new Error(`Renter with id ${renterId} not found`);
    }

    if (renter.applicationStatus !== 'pending') {
      throw new Error('Application is not in pending status');
    }

    const newStatus: ApplicationStatus = decision === 'approve' ? 'approved' : 'rejected';
    const renterNotes = notes ? `${renter.internalNotes || ''}\n${new Date().toISOString()}: ${notes}` : renter.internalNotes;

    return this.renterRepository.update(renterId, {
      applicationStatus: newStatus,
      internalNotes: renterNotes
    }) as Promise<IRenter>;
  }

  async evaluateApplication(renterId: string, minIncomeRatio: number = 3): Promise<ApplicationDecision> {
    const renter = await this.renterRepository.findById(renterId);
    if (!renter) {
      throw new Error(`Renter with id ${renterId} not found`);
    }

    const renterInstance = new Renter(renter);
    const qualification = renterInstance.isQualified(minIncomeRatio);

    const conditions: string[] = [];
    const requiredDocuments: string[] = [];

    // Additional conditions based on application
    if (renter.creditInfo.creditScore && renter.creditInfo.creditScore < 650) {
      conditions.push('Higher security deposit required due to credit score');
    }

    if (!renter.references.some(ref => ref.relationship === 'previous_landlord')) {
      requiredDocuments.push('Previous landlord reference');
    }

    if (!renter.documents?.some(doc => doc.type === 'income_proof')) {
      requiredDocuments.push('Proof of income');
    }

    if (!renter.documents?.some(doc => doc.type === 'id')) {
      requiredDocuments.push('Government-issued ID');
    }

    return {
      approved: qualification.qualified && requiredDocuments.length === 0,
      reasons: qualification.reasons,
      conditions: conditions.length > 0 ? conditions : undefined,
      requiredDocuments: requiredDocuments.length > 0 ? requiredDocuments : undefined
    };
  }

  async addCommunicationRecord(renterId: string, record: {
    type: 'email' | 'phone' | 'in-person' | 'text';
    summary: string;
    followUpRequired?: boolean;
  }): Promise<IRenter> {
    const renter = await this.renterRepository.findById(renterId);
    if (!renter) {
      throw new Error(`Renter with id ${renterId} not found`);
    }

    const newRecord = {
      date: new Date(),
      type: record.type,
      summary: record.summary,
      followUpRequired: record.followUpRequired || false
    };

    const updatedHistory = [...(renter.communicationHistory || []), newRecord];

    return this.renterRepository.update(renterId, {
      communicationHistory: updatedHistory
    }) as Promise<IRenter>;
  }

  async getLeasesExpiring(daysFromNow: number): Promise<IRenter[]> {
    return this.renterRepository.findRentersWithLeaseExpiring(daysFromNow);
  }

  async getRentersRequiringFollowUp(): Promise<IRenter[]> {
    return this.renterRepository.findRentersRequiringFollowUp();
  }

  async searchRenters(query: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    status?: RenterStatus;
    applicationStatus?: ApplicationStatus;
    rentalId?: string;
  }): Promise<IRenter[]> {
    return this.renterRepository.searchRenters(query);
  }

  async getRenterSummary(): Promise<RenterSummary> {
    const [
      allRenters,
      currentRenters,
      prospectiveRenters,
      pastRenters,
      pendingApplications,
      approvedApplications,
      leasesExpiring,
      followUpRequired
    ] = await Promise.all([
      this.renterRepository.findAll(),
      this.renterRepository.findCurrentRenters(),
      this.renterRepository.findProspectiveRenters(),
      this.renterRepository.findPastRenters(),
      this.renterRepository.findByApplicationStatus('pending'),
      this.renterRepository.findByApplicationStatus('approved'),
      this.renterRepository.findRentersWithLeaseExpiring(30), // Next 30 days
      this.renterRepository.findRentersRequiringFollowUp()
    ]);

    return {
      totalRenters: allRenters.length,
      currentRenters: currentRenters.length,
      prospectiveRenters: prospectiveRenters.length,
      pastRenters: pastRenters.length,
      pendingApplications: pendingApplications.length,
      approvedApplications: approvedApplications.length,
      leasesExpiringThisMonth: leasesExpiring.length,
      followUpRequired: followUpRequired.length
    };
  }

  private async validateRenterData(data: Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!data.firstName || data.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
      throw new Error('Phone number is required');
    }

    if (!data.dateOfBirth) {
      throw new Error('Date of birth is required');
    }

    // Check age (must be 18 or older)
    const age = this.calculateAge(data.dateOfBirth);
    if (age < 18) {
      throw new Error('Renter must be 18 years or older');
    }

    if (!data.currentAddress || !data.currentAddress.street || !data.currentAddress.city) {
      throw new Error('Valid current address is required');
    }

    if (data.totalMonthlyIncome < 0) {
      throw new Error('Total monthly income cannot be negative');
    }

    // Check email uniqueness
    const existingRenter = await this.renterRepository.findByEmail(data.email);
    if (existingRenter) {
      throw new Error('Email already exists');
    }

    if (data.preferences?.maxRent && data.preferences.maxRent <= 0) {
      throw new Error('Maximum rent preference must be greater than 0');
    }

    if (data.preferences?.leaseDuration && data.preferences.leaseDuration <= 0) {
      throw new Error('Lease duration preference must be greater than 0');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}