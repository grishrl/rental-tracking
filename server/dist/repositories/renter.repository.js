"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenterRepository = void 0;
const memory_repository_1 = require("./memory.repository");
class RenterRepository extends memory_repository_1.InMemoryRepository {
    constructor() {
        super('renters');
    }
    async findByStatus(status) {
        return this.findBy({ status });
    }
    async findByApplicationStatus(status) {
        return this.findBy({ applicationStatus: status });
    }
    async findByRental(rentalId) {
        return this.findBy({ currentRentalId: rentalId });
    }
    async findByEmail(email) {
        const renters = await this.findBy({ email });
        return renters.length > 0 ? renters[0] : null;
    }
    async findByName(firstName, lastName) {
        return this.findBy({ firstName, lastName });
    }
    async findCurrentRenters() {
        return this.findByStatus('current');
    }
    async findProspectiveRenters() {
        return this.findByStatus('prospective');
    }
    async findPastRenters() {
        return this.findByStatus('past');
    }
    async findRentersWithLeaseExpiring(daysFromNow) {
        const allRenters = await this.findAll();
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysFromNow);
        return allRenters.filter(renter => renter.status === 'current' &&
            renter.leaseEndDate &&
            renter.leaseEndDate <= targetDate &&
            renter.leaseEndDate >= new Date());
    }
    async findRentersRequiringFollowUp() {
        const allRenters = await this.findAll();
        return allRenters.filter(renter => renter.communicationHistory &&
            renter.communicationHistory.some(comm => comm.followUpRequired));
    }
    async searchRenters(query) {
        let results = await this.findAll();
        if (query.name) {
            const nameLower = query.name.toLowerCase();
            results = results.filter(renter => renter.firstName.toLowerCase().includes(nameLower) ||
                renter.lastName.toLowerCase().includes(nameLower) ||
                `${renter.firstName} ${renter.lastName}`.toLowerCase().includes(nameLower));
        }
        if (query.email) {
            results = results.filter(renter => renter.email.toLowerCase().includes(query.email.toLowerCase()));
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
exports.RenterRepository = RenterRepository;
//# sourceMappingURL=renter.repository.js.map