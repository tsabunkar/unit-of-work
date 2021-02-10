import { injectable } from 'inversify';
import { TypeOrmUnitOfWork } from './typeorm-uow';
import { TransactionUnitOfWork } from './transaction-uow.interface';

@injectable()
export class TransactionUnitOfWorkFactory {
  registerORM(ormType: string): TransactionUnitOfWork {
    if (ormType === 'typeorm') {
      return new TypeOrmUnitOfWork();
    } else if (ormType === 'sequelize') {
      // return new SequelizeUnitOfWork();
    }
    return null;
  }
}
