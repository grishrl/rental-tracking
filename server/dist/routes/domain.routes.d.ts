import { Router } from 'express';
import { RentalService } from '../services/rental.service';
import { UserService } from '../services/user.service';
import { RenterService } from '../services/renter.service';
import { BucketService } from '../services/bucket.service';
import { CashFlowService } from '../services/cashflow.service';
export interface DomainServices {
    userService: UserService;
    rentalService: RentalService;
    renterService: RenterService;
    bucketService: BucketService;
    cashFlowService: CashFlowService;
}
export declare const createDomainRouter: (services: DomainServices) => Router;
//# sourceMappingURL=domain.routes.d.ts.map