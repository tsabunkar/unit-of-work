import { TransactionUnitOfWork } from './transaction-uow.interface';
import { TypeOrmUnitOfWork } from './typeorm/typeorm-uow';
import { SequelizeUnitOfWork } from './sequelize/sequelize-uow';
import { UOW } from './transaction-uow.constant';

export class TransactionFactory {
  constructor() {}
  registerORM(ormType: string): TransactionUnitOfWork {
    if (ormType === UOW.VENDOR.TYPEORM) {
      return new TypeOrmUnitOfWork();
    } else if (ormType === UOW.VENDOR.SEQUELIZE) {
      return new SequelizeUnitOfWork();
    }
    return null;
  }
}
