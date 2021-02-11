import { injectable } from 'inversify';
import { TransactionUnitOfWork } from '../transaction-uow.interface';

// TODO: Should Also complete for Sequlize ORM library also
@injectable()
export class SequelizeUnitOfWork implements TransactionUnitOfWork {
  start(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  complete(work: () => void): Promise<void> {
    throw new Error('Method not implemented.');
  }
  registerRepository(repositry: any) {
    throw new Error('Method not implemented.');
  }
  registerCustomRepository(customRepository: any) {
    throw new Error('Method not implemented.');
  }
}
