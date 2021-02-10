import { injectable } from 'inversify';
import { TypeOrmUnitOfWork } from './typeorm-uow';
import { TransactionUnitOfWork } from './transaction-uow.interface';

@injectable()
export class TransactionUnitOfWorkFactory {
  registerORM(ormType: string): TransactionUnitOfWork {
    console.log('INSIDE TransactionUnitOfWorkFactory.registerORM()');
    if (ormType === 'typeorm') {
      return new TypeOrmUnitOfWork();
    } else if (ormType === 'sequelize') {
      // return new SequelizeUnitOfWork();
    }
    return null;
  }
}
