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
  // Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
  
  // Address Information
  currentAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Identification
  driversLicenseNumber?: string;
  socialSecurityNumber?: string; // Should be encrypted in real implementation
  
  // Status and Application
  status: RenterStatus;
  applicationStatus: ApplicationStatus;
  applicationDate?: Date;
  moveInDate?: Date;
  moveOutDate?: Date;
  
  // Employment and Financial Info
  currentEmployment?: Employment;
  previousEmployments?: Employment[];
  otherIncomeSource?: string;
  totalMonthlyIncome: number;
  
  // References and History
  emergencyContacts: EmergencyContact[];
  references: Reference[];
  rentalHistory: RentalHistory[];
  
  // Credit and Background
  creditInfo: CreditInfo;
  
  // Rental Preferences
  preferences?: {
    maxRent: number;
    preferredMoveInDate?: Date;
    leaseDuration: number; // in months
    petOwner: boolean;
    smokingStatus: 'non-smoker' | 'smoker' | 'occasional';
    specialRequests?: string;
  };
  
  // Current Rental Information (if renting)
  currentRentalId?: string;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  monthlyRent?: number;
  securityDeposit?: number;
  
  // Documents and Notes
  documents?: {
    type: 'id' | 'income_proof' | 'reference_letter' | 'credit_report' | 'other';
    filename: string;
    uploadDate: Date;
  }[];
  notes?: string;
  internalNotes?: string; // Private notes for landlord/property manager
  
  // Communication
  preferredContactMethod: 'email' | 'phone' | 'text';
  communicationHistory?: {
    date: Date;
    type: 'email' | 'phone' | 'in-person' | 'text';
    summary: string;
    followUpRequired: boolean;
  }[];
}

export class Renter implements IRenter {
  public id: string;
  public firstName: string;
  public lastName: string;
  public dateOfBirth: Date;
  public email: string;
  public phoneNumber: string;
  public alternatePhone?: string;
  public currentAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  public driversLicenseNumber?: string;
  public socialSecurityNumber?: string;
  public status: RenterStatus;
  public applicationStatus: ApplicationStatus;
  public applicationDate?: Date;
  public moveInDate?: Date;
  public moveOutDate?: Date;
  public currentEmployment?: Employment;
  public previousEmployments?: Employment[];
  public otherIncomeSource?: string;
  public totalMonthlyIncome: number;
  public emergencyContacts: EmergencyContact[];
  public references: Reference[];
  public rentalHistory: RentalHistory[];
  public creditInfo: CreditInfo;
  public preferences?: {
    maxRent: number;
    preferredMoveInDate?: Date;
    leaseDuration: number;
    petOwner: boolean;
    smokingStatus: 'non-smoker' | 'smoker' | 'occasional';
    specialRequests?: string;
  };
  public currentRentalId?: string;
  public leaseStartDate?: Date;
  public leaseEndDate?: Date;
  public monthlyRent?: number;
  public securityDeposit?: number;
  public documents?: {
    type: 'id' | 'income_proof' | 'reference_letter' | 'credit_report' | 'other';
    filename: string;
    uploadDate: Date;
  }[];
  public notes?: string;
  public internalNotes?: string;
  public preferredContactMethod: 'email' | 'phone' | 'text';
  public communicationHistory?: {
    date: Date;
    type: 'email' | 'phone' | 'in-person' | 'text';
    summary: string;
    followUpRequired: boolean;
  }[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Omit<IRenter, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = this.generateId();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.alternatePhone = data.alternatePhone;
    this.currentAddress = data.currentAddress;
    this.driversLicenseNumber = data.driversLicenseNumber;
    this.socialSecurityNumber = data.socialSecurityNumber;
    this.status = data.status;
    this.applicationStatus = data.applicationStatus;
    this.applicationDate = data.applicationDate;
    this.moveInDate = data.moveInDate;
    this.moveOutDate = data.moveOutDate;
    this.currentEmployment = data.currentEmployment;
    this.previousEmployments = data.previousEmployments || [];
    this.otherIncomeSource = data.otherIncomeSource;
    this.totalMonthlyIncome = data.totalMonthlyIncome;
    this.emergencyContacts = data.emergencyContacts || [];
    this.references = data.references || [];
    this.rentalHistory = data.rentalHistory || [];
    this.creditInfo = data.creditInfo;
    this.preferences = data.preferences;
    this.currentRentalId = data.currentRentalId;
    this.leaseStartDate = data.leaseStartDate;
    this.leaseEndDate = data.leaseEndDate;
    this.monthlyRent = data.monthlyRent;
    this.securityDeposit = data.securityDeposit;
    this.documents = data.documents || [];
    this.notes = data.notes;
    this.internalNotes = data.internalNotes;
    this.preferredContactMethod = data.preferredContactMethod;
    this.communicationHistory = data.communicationHistory || [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  public addEmergencyContact(contact: EmergencyContact): void {
    this.emergencyContacts.push(contact);
    this.updateTimestamp();
  }

  public addReference(reference: Reference): void {
    this.references.push(reference);
    this.updateTimestamp();
  }

  public addCommunicationRecord(record: {
    type: 'email' | 'phone' | 'in-person' | 'text';
    summary: string;
    followUpRequired?: boolean;
  }): void {
    this.communicationHistory = this.communicationHistory || [];
    this.communicationHistory.push({
      date: new Date(),
      type: record.type,
      summary: record.summary,
      followUpRequired: record.followUpRequired || false
    });
    this.updateTimestamp();
  }

  public assignToRental(rentalId: string, leaseStart: Date, leaseEnd: Date, monthlyRent: number, securityDeposit?: number): void {
    this.currentRentalId = rentalId;
    this.leaseStartDate = leaseStart;
    this.leaseEndDate = leaseEnd;
    this.monthlyRent = monthlyRent;
    this.securityDeposit = securityDeposit;
    this.status = 'current';
    this.applicationStatus = 'approved';
    this.moveInDate = leaseStart;
    this.updateTimestamp();
  }

  public endLease(moveOutDate: Date): void {
    this.moveOutDate = moveOutDate;
    this.status = 'past';
    this.updateTimestamp();
  }

  public calculateIncomeToRentRatio(): number {
    if (!this.monthlyRent || this.totalMonthlyIncome === 0) return 0;
    return this.totalMonthlyIncome / this.monthlyRent;
  }

  public isQualified(minIncomeRatio: number = 3): {
    qualified: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    
    // Income qualification
    if (this.preferences?.maxRent) {
      const incomeRatio = this.totalMonthlyIncome / this.preferences.maxRent;
      if (incomeRatio < minIncomeRatio) {
        reasons.push(`Income too low (ratio: ${incomeRatio.toFixed(1)}, required: ${minIncomeRatio})`);
      }
    }
    
    // Credit issues
    if (this.creditInfo.bankruptcyHistory) {
      reasons.push('Bankruptcy history');
    }
    
    if (this.creditInfo.evictionHistory) {
      reasons.push('Eviction history');
    }
    
    if (this.creditInfo.criminalBackground) {
      reasons.push('Criminal background');
    }
    
    // Age requirement
    if (this.getAge() < 18) {
      reasons.push('Under 18 years old');
    }
    
    // References
    if (this.references.length === 0) {
      reasons.push('No references provided');
    }
    
    return {
      qualified: reasons.length === 0,
      reasons
    };
  }

  public toJSON(): IRenter {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      phoneNumber: this.phoneNumber,
      alternatePhone: this.alternatePhone,
      currentAddress: this.currentAddress,
      driversLicenseNumber: this.driversLicenseNumber,
      socialSecurityNumber: this.socialSecurityNumber,
      status: this.status,
      applicationStatus: this.applicationStatus,
      applicationDate: this.applicationDate,
      moveInDate: this.moveInDate,
      moveOutDate: this.moveOutDate,
      currentEmployment: this.currentEmployment,
      previousEmployments: this.previousEmployments,
      otherIncomeSource: this.otherIncomeSource,
      totalMonthlyIncome: this.totalMonthlyIncome,
      emergencyContacts: this.emergencyContacts,
      references: this.references,
      rentalHistory: this.rentalHistory,
      creditInfo: this.creditInfo,
      preferences: this.preferences,
      currentRentalId: this.currentRentalId,
      leaseStartDate: this.leaseStartDate,
      leaseEndDate: this.leaseEndDate,
      monthlyRent: this.monthlyRent,
      securityDeposit: this.securityDeposit,
      documents: this.documents,
      notes: this.notes,
      internalNotes: this.internalNotes,
      preferredContactMethod: this.preferredContactMethod,
      communicationHistory: this.communicationHistory,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}