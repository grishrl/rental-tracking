import { BaseEntity } from '../interfaces/repository.interface';

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
  leaseDuration?: number; // in months
  petPolicy?: 'allowed' | 'not-allowed' | 'deposit-required';
  utilities?: {
    electricity: boolean;
    water: boolean;
    gas: boolean;
    internet: boolean;
    cable: boolean;
  };
  
  // Renter relationship
  currentRenterIds?: string[]; // Array to support multiple renters (roommates)
  leaseInfo?: {
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    securityDeposit: number;
    leaseTerms?: string;
  };
}

export class Rental implements IRental {
  public id: string;
  public title: string;
  public description: string;
  public price: number;
  public location: string;
  public address?: string;
  public bedrooms?: number;
  public bathrooms?: number;
  public squareFootage?: number;
  public amenities?: string[];
  public images?: string[];
  public ownerId: string;
  public isAvailable: boolean;
  public availableFrom?: Date;
  public leaseDuration?: number;
  public petPolicy?: 'allowed' | 'not-allowed' | 'deposit-required';
  public utilities?: {
    electricity: boolean;
    water: boolean;
    gas: boolean;
    internet: boolean;
    cable: boolean;
  };
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Omit<IRental, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = this.generateId();
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.location = data.location;
    this.address = data.address;
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.squareFootage = data.squareFootage;
    this.amenities = data.amenities || [];
    this.images = data.images || [];
    this.ownerId = data.ownerId;
    this.isAvailable = data.isAvailable;
    this.availableFrom = data.availableFrom;
    this.leaseDuration = data.leaseDuration;
    this.petPolicy = data.petPolicy;
    this.utilities = data.utilities;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public toJSON(): IRental {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      location: this.location,
      address: this.address,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      squareFootage: this.squareFootage,
      amenities: this.amenities,
      images: this.images,
      ownerId: this.ownerId,
      isAvailable: this.isAvailable,
      availableFrom: this.availableFrom,
      leaseDuration: this.leaseDuration,
      petPolicy: this.petPolicy,
      utilities: this.utilities,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}