import { Router } from 'express';
import { RentalService } from '../services/rental.service';
import { UserService } from '../services/user.service';
import { RenterService } from '../services/renter.service';
import { BucketService } from '../services/bucket.service';
import { CashFlowService } from '../services/cashflow.service';
import { UserController } from '../controllers/user.controller';
import { RentalController } from '../controllers/rental.controller';
import { RenterController } from '../controllers/renter.controller';
import { BucketController } from '../controllers/bucket.controller';
import { CashFlowController } from '../controllers/cashflow.controller';

export interface DomainServices {
  userService: UserService;
  rentalService: RentalService;
  renterService: RenterService;
  bucketService: BucketService;
  cashFlowService: CashFlowService;
}

export const createDomainRouter = (services: DomainServices): Router => {
  const router = Router();

  const userController = new UserController(services.userService);
  router.get('/user/getAll', userController.getAll);
  router.get('/user/get/:id', userController.get);
  router.post('/user/create', userController.create);
  router.put('/user/update/:id', userController.update);
  router.delete('/user/delete/:id', userController.delete);
  router.get('/users', userController.getAll);
  router.get('/users/:id', userController.get);
  router.post('/users', userController.create);
  router.put('/users/:id', userController.update);
  router.delete('/users/:id', userController.delete);

  const rentalController = new RentalController(services.rentalService);
  router.get('/rental/getAll', rentalController.getAll);
  router.get('/rental/get/:id', rentalController.get);
  router.post('/rental/create', rentalController.create);
  router.put('/rental/update/:id', rentalController.update);
  router.delete('/rental/delete/:id', rentalController.delete);
  router.get('/rentals', rentalController.listLegacy);
  router.get('/rentals/:id', rentalController.get);
  router.post('/rentals', rentalController.create);
  router.put('/rentals/:id', rentalController.update);
  router.delete('/rentals/:id', rentalController.delete);

  const renterController = new RenterController(services.renterService);
  router.get('/renter/getAll', renterController.getAll);
  router.get('/renter/get/:id', renterController.get);
  router.post('/renter/create', renterController.create);
  router.put('/renter/update/:id', renterController.update);
  router.delete('/renter/delete/:id', renterController.delete);
  router.get('/renters', renterController.listLegacy);
  router.get('/renters/summary', renterController.getSummary);
  router.get('/renters/current', renterController.getCurrent);
  router.get('/renters/prospective', renterController.getProspective);
  router.get('/renters/leases-expiring', renterController.getLeasesExpiring);
  router.get('/renters/follow-up', renterController.getFollowUp);
  router.get('/renters/:id', renterController.get);
  router.post('/renters', renterController.create);
  router.put('/renters/:id', renterController.update);
  router.delete('/renters/:id', renterController.delete);
  router.post('/renters/:id/assign-rental', renterController.assignRental);
  router.post('/renters/:id/end-lease', renterController.endLease);
  router.post('/renters/:id/process-application', renterController.processApplication);
  router.get('/renters/:id/evaluate-application', renterController.evaluateApplication);
  router.post('/renters/:id/communication', renterController.addCommunication);

  const bucketController = new BucketController(services.bucketService);
  router.get('/bucket/getAll', bucketController.getAll);
  router.get('/bucket/get/:id', bucketController.get);
  router.post('/bucket/create', bucketController.create);
  router.put('/bucket/update/:id', bucketController.update);
  router.delete('/bucket/delete/:id', bucketController.delete);

  const cashFlowController = new CashFlowController(services.cashFlowService);
  router.get('/cashflow/getAll', cashFlowController.getAll);
  router.get('/cashflow/get/:id', cashFlowController.get);
  router.post('/cashflow/create', cashFlowController.create);
  router.put('/cashflow/update/:id', cashFlowController.update);
  router.delete('/cashflow/delete/:id', cashFlowController.delete);

  return router;
};
