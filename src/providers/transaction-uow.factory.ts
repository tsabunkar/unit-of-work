import { injectable } from 'inversify';
import { TransactionUnitOfWork } from './transaction-uow.interface';
import { TypeOrmUnitOfWork } from './typeorm/typeorm-uow';
import { SequelizeUnitOfWork } from './sequelize/sequelize-uow';
import { UOW } from './transaction-uow.constant';

@injectable()
export class TransactionUnitOfWorkFactory {
  constructor(
    private typeOrmUnitOfWork: TypeOrmUnitOfWork,
    private sequelizeUnitOfWork: SequelizeUnitOfWork
  ) {}
  registerORM(ormType: string): TransactionUnitOfWork {
    if (ormType === UOW.VENDOR.TYPEORM) {
      return this.typeOrmUnitOfWork;
    } else if (ormType === UOW.VENDOR.SEQUELIZE) {
      return this.sequelizeUnitOfWork;
    }
    return null;
  }
}
