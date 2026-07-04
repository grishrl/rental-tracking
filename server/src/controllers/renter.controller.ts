import { Request, Response } from 'express';
import { RenterService } from '../services/renter.service';
import { ApplicationStatus, RenterStatus } from '../models/renter.model';

export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const renters = await this.renterService.getAllRenters();
      res.json(renters);
    } catch {
      res.status(500).json({ error: 'Failed to fetch renters' });
    }
  };

  listLegacy = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, applicationStatus, name, email, phoneNumber, rentalId } = req.query;

      if (status || applicationStatus || name || email || phoneNumber || rentalId) {
        const searchParams: {
          status?: RenterStatus;
          applicationStatus?: ApplicationStatus;
          name?: string;
          email?: string;
          phoneNumber?: string;
          rentalId?: string;
        } = {};

        if (status) searchParams.status = status as RenterStatus;
        if (applicationStatus) searchParams.applicationStatus = applicationStatus as ApplicationStatus;
        if (name) searchParams.name = name as string;
        if (email) searchParams.email = email as string;
        if (phoneNumber) searchParams.phoneNumber = phoneNumber as string;
        if (rentalId) searchParams.rentalId = rentalId as string;

        const renters = await this.renterService.searchRenters(searchParams);
        res.json(renters);
        return;
      }

      const renters = await this.renterService.getAllRenters();
      res.json(renters);
    } catch {
      res.status(500).json({ error: 'Failed to fetch renters' });
    }
  };

  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const renter = await this.renterService.getRenterById(req.params.id);
      if (!renter) {
        res.status(404).json({ error: 'Renter not found' });
        return;
      }

      res.json(renter);
    } catch {
      res.status(500).json({ error: 'Failed to fetch renter' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const renter = await this.renterService.createRenter(req.body);
      res.status(201).json(renter);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const renter = await this.renterService.updateRenter(req.params.id, req.body);
      if (!renter) {
        res.status(404).json({ error: 'Renter not found' });
        return;
      }

      res.json(renter);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.renterService.deleteRenter(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Renter not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getSummary = async (_req: Request, res: Response): Promise<void> => {
    try {
      const summary = await this.renterService.getRenterSummary();
      res.json(summary);
    } catch {
      res.status(500).json({ error: 'Failed to fetch renter summary' });
    }
  };

  getCurrent = async (_req: Request, res: Response): Promise<void> => {
    try {
      const renters = await this.renterService.getCurrentRenters();
      res.json(renters);
    } catch {
      res.status(500).json({ error: 'Failed to fetch current renters' });
    }
  };

  getProspective = async (_req: Request, res: Response): Promise<void> => {
    try {
      const renters = await this.renterService.getProspectiveRenters();
      res.json(renters);
    } catch {
      res.status(500).json({ error: 'Failed to fetch prospective renters' });
    }
  };

  getLeasesExpiring = async (req: Request, res: Response): Promise<void> => {
    try {
      const days = parseInt((req.query.days as string) || '30', 10);
      const renters = await this.renterService.getLeasesExpiring(days);
      res.json(renters);
    } catch {
      res.status(500).json({ error: 'Failed to fetch renters with expiring leases' });
    }
  };

  getFollowUp = async (_req: Request, res: Response): Promise<void> => {
    try {
      const renters = await this.renterService.getRentersRequiringFollowUp();
      res.json(renters);
    } catch {
      res.status(500).json({ error: 'Failed to fetch renters requiring follow-up' });
    }
  };

  assignRental = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rentalId, startDate, endDate, monthlyRent, securityDeposit } = req.body;
      const result = await this.renterService.assignRenterToRental(req.params.id, rentalId, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent,
        securityDeposit,
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  endLease = async (req: Request, res: Response): Promise<void> => {
    try {
      const { moveOutDate } = req.body;
      const result = await this.renterService.endLease(req.params.id, new Date(moveOutDate));
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  processApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const { decision, notes } = req.body;
      const renter = await this.renterService.processApplication(req.params.id, decision, notes);
      res.json(renter);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  evaluateApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const minIncomeRatio = parseFloat((req.query.minIncomeRatio as string) || '3');
      const evaluation = await this.renterService.evaluateApplication(req.params.id, minIncomeRatio);
      res.json(evaluation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  addCommunication = async (req: Request, res: Response): Promise<void> => {
    try {
      const renter = await this.renterService.addCommunicationRecord(req.params.id, req.body);
      res.json(renter);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
