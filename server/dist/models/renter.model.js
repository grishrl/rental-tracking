"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renter = void 0;
class Renter {
    constructor(data) {
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
        this.interestedRentalId = data.interestedRentalId;
        this.leaseStartDate = data.leaseStartDate;
        this.leaseEndDate = data.leaseEndDate;
        this.monthlyRent = data.monthlyRent;
        this.securityDeposit = data.securityDeposit;
        this.inquiryMessage = data.inquiryMessage;
        this.leadSource = data.leadSource;
        this.documents = data.documents || [];
        this.notes = data.notes;
        this.internalNotes = data.internalNotes;
        this.preferredContactMethod = data.preferredContactMethod;
        this.communicationHistory = data.communicationHistory || [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    updateTimestamp() {
        this.updatedAt = new Date();
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    getAge() {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    addEmergencyContact(contact) {
        this.emergencyContacts.push(contact);
        this.updateTimestamp();
    }
    addReference(reference) {
        this.references.push(reference);
        this.updateTimestamp();
    }
    addCommunicationRecord(record) {
        this.communicationHistory = this.communicationHistory || [];
        this.communicationHistory.push({
            date: new Date(),
            type: record.type,
            summary: record.summary,
            followUpRequired: record.followUpRequired || false
        });
        this.updateTimestamp();
    }
    assignToRental(rentalId, leaseStart, leaseEnd, monthlyRent, securityDeposit) {
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
    endLease(moveOutDate) {
        this.moveOutDate = moveOutDate;
        this.status = 'past';
        this.updateTimestamp();
    }
    calculateIncomeToRentRatio() {
        if (!this.monthlyRent || this.totalMonthlyIncome === 0)
            return 0;
        return this.totalMonthlyIncome / this.monthlyRent;
    }
    isQualified(minIncomeRatio = 3) {
        const reasons = [];
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
    toJSON() {
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
            interestedRentalId: this.interestedRentalId,
            leaseStartDate: this.leaseStartDate,
            leaseEndDate: this.leaseEndDate,
            monthlyRent: this.monthlyRent,
            securityDeposit: this.securityDeposit,
            inquiryMessage: this.inquiryMessage,
            leadSource: this.leadSource,
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
exports.Renter = Renter;
//# sourceMappingURL=renter.model.js.map