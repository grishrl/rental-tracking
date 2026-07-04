import { IModelStore } from './store.interface';
import { IUser } from '../models/user.model';
import { IRental } from '../models/rental.model';
import { IRenter } from '../models/renter.model';
import { IBucket } from '../models/bucket.model';
import { ICashFlow } from '../models/cashflow.model';

// Typed model-store registry so implementations can be swapped without service changes.
export interface IModelStoreRegistry {
  users: IModelStore<IUser>;
  rentals: IModelStore<IRental>;
  renters: IModelStore<IRenter>;
  buckets: IModelStore<IBucket>;
  cashflows: IModelStore<ICashFlow>;
}
