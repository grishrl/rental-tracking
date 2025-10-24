"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenterService = void 0;
const renter_model_1 = require("../models/renter.model");
class RenterService {
    constructor(renterRepository, rentalRepository) {
        this.renterRepository = renterRepository;
        this.rentalRepository = rentalRepository;
    }
    async createRenter(renterData) {
        // Validate renter data
        await this.validateRenterData(renterData);
        const renter = new renter_model_1.Renter(renterData);
        return this.renterRepository.create(renter.toJSON());
    }
    async updateRenter(id, updates) {
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
    async deleteRenter(id) {
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
    async getRenterById(id) {
        return this.renterRepository.findById(id);
    }
    async getRenterByEmail(email) {
        return this.renterRepository.findByEmail(email);
    }
    async getAllRenters() {
        return this.renterRepository.findAll();
    }
    async getRentersByStatus(status) {
        return this.renterRepository.findByStatus(status);
    }
    async getRentersByApplicationStatus(status) {
        return this.renterRepository.findByApplicationStatus(status);
    }
    async getCurrentRenters() {
        return this.renterRepository.findCurrentRenters();
    }
    async getProspectiveRenters() {
        return this.renterRepository.findProspectiveRenters();
    }
    async getRentersForRental(rentalId) {
        return this.renterRepository.findByRental(rentalId);
    }
    async assignRenterToRental(renterId, rentalId, leaseDetails) {
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
        return { renter: updatedRenter, rental: updatedRental };
    }
    async endLease(renterId, moveOutDate) {
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
        return { renter: updatedRenter, rental: updatedRental };
    }
    async processApplication(renterId, decision, notes) {
        const renter = await this.renterRepository.findById(renterId);
        if (!renter) {
            throw new Error(`Renter with id ${renterId} not found`);
        }
        if (renter.applicationStatus !== 'pending') {
            throw new Error('Application is not in pending status');
        }
        const newStatus = decision === 'approve' ? 'approved' : 'rejected';
        const renterNotes = notes ? `${renter.internalNotes || ''}\n${new Date().toISOString()}: ${notes}` : renter.internalNotes;
        return this.renterRepository.update(renterId, {
            applicationStatus: newStatus,
            internalNotes: renterNotes
        });
    }
    async evaluateApplication(renterId, minIncomeRatio = 3) {
        const renter = await this.renterRepository.findById(renterId);
        if (!renter) {
            throw new Error(`Renter with id ${renterId} not found`);
        }
        const renterInstance = new renter_model_1.Renter(renter);
        const qualification = renterInstance.isQualified(minIncomeRatio);
        const conditions = [];
        const requiredDocuments = [];
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
    async addCommunicationRecord(renterId, record) {
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
        });
    }
    async getLeasesExpiring(daysFromNow) {
        return this.renterRepository.findRentersWithLeaseExpiring(daysFromNow);
    }
    async getRentersRequiringFollowUp() {
        return this.renterRepository.findRentersRequiringFollowUp();
    }
    async searchRenters(query) {
        return this.renterRepository.searchRenters(query);
    }
    async getRenterSummary() {
        const [allRenters, currentRenters, prospectiveRenters, pastRenters, pendingApplications, approvedApplications, leasesExpiring, followUpRequired] = await Promise.all([
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
    async validateRenterData(data) {
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
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    calculateAge(dateOfBirth) {
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
exports.RenterService = RenterService;
//# sourceMappingURL=renter.service.js.map