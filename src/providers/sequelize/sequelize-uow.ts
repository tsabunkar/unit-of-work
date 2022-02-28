import { TransactionUnitOfWork } from '../transaction-uow.interface';

// TODO: Should Also complete for Sequlize ORM library also
export class SequelizeUnitOfWork implements TransactionUnitOfWork {
  start(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  complete<T>(work: () => T | Promise<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }
  registerRepository(repositry: any) {
    throw new Error('Method not implemented.');
  }
  registerCustomRepository(customRepository: any) {
    throw new Error('Method not implemented.');
  }
}
