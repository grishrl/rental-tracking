"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenterController = void 0;
class RenterController {
    constructor(renterService) {
        this.renterService = renterService;
        this.getAll = async (_req, res) => {
            try {
                const renters = await this.renterService.getAllRenters();
                res.json(renters);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch renters' });
            }
        };
        this.listLegacy = async (req, res) => {
            try {
                const { status, applicationStatus, name, email, phoneNumber, rentalId } = req.query;
                if (status || applicationStatus || name || email || phoneNumber || rentalId) {
                    const searchParams = {};
                    if (status)
                        searchParams.status = status;
                    if (applicationStatus)
                        searchParams.applicationStatus = applicationStatus;
                    if (name)
                        searchParams.name = name;
                    if (email)
                        searchParams.email = email;
                    if (phoneNumber)
                        searchParams.phoneNumber = phoneNumber;
                    if (rentalId)
                        searchParams.rentalId = rentalId;
                    const renters = await this.renterService.searchRenters(searchParams);
                    res.json(renters);
                    return;
                }
                const renters = await this.renterService.getAllRenters();
                res.json(renters);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch renters' });
            }
        };
        this.get = async (req, res) => {
            try {
                const renter = await this.renterService.getRenterById(req.params.id);
                if (!renter) {
                    res.status(404).json({ error: 'Renter not found' });
                    return;
                }
                res.json(renter);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch renter' });
            }
        };
        this.create = async (req, res) => {
            try {
                const renter = await this.renterService.createRenter(req.body);
                res.status(201).json(renter);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const renter = await this.renterService.updateRenter(req.params.id, req.body);
                if (!renter) {
                    res.status(404).json({ error: 'Renter not found' });
                    return;
                }
                res.json(renter);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await this.renterService.deleteRenter(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'Renter not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.getSummary = async (_req, res) => {
            try {
                const summary = await this.renterService.getRenterSummary();
                res.json(summary);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch renter summary' });
            }
        };
        this.getCurrent = async (_req, res) => {
            try {
                const renters = await this.renterService.getCurrentRenters();
                res.json(renters);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch current renters' });
            }
        };
        this.getProspective = async (_req, res) => {
            try {
                const renters = await this.renterService.getProspectiveRenters();
                res.json(renters);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch prospective renters' });
            }
        };
        this.getLeasesExpiring = async (req, res) => {
            try {
                const days = parseInt(req.query.days || '30', 10);
                const renters = await this.renterService.getLeasesExpiring(days);
                res.json(renters);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch renters with expiring leases' });
            }
        };
        this.getFollowUp = async (_req, res) => {
            try {
                const renters = await this.renterService.getRentersRequiringFollowUp();
                res.json(renters);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch renters requiring follow-up' });
            }
        };
        this.assignRental = async (req, res) => {
            try {
                const { rentalId, startDate, endDate, monthlyRent, securityDeposit } = req.body;
                const result = await this.renterService.assignRenterToRental(req.params.id, rentalId, {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    monthlyRent,
                    securityDeposit,
                });
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.endLease = async (req, res) => {
            try {
                const { moveOutDate } = req.body;
                const result = await this.renterService.endLease(req.params.id, new Date(moveOutDate));
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.processApplication = async (req, res) => {
            try {
                const { decision, notes } = req.body;
                const renter = await this.renterService.processApplication(req.params.id, decision, notes);
                res.json(renter);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.evaluateApplication = async (req, res) => {
            try {
                const minIncomeRatio = parseFloat(req.query.minIncomeRatio || '3');
                const evaluation = await this.renterService.evaluateApplication(req.params.id, minIncomeRatio);
                res.json(evaluation);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.addCommunication = async (req, res) => {
            try {
                const renter = await this.renterService.addCommunicationRecord(req.params.id, req.body);
                res.json(renter);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}
exports.RenterController = RenterController;
//# sourceMappingURL=renter.controller.js.map