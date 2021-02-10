import { TransactionUnitOfWork } from './transaction-uow.interface';
import {
  Connection,
  QueryRunner,
  EntityManager,
  getConnection,
  Repository,
  EntitySchema,
  ObjectType,
} from 'typeorm';

export class TypeOrmUnitOfWork implements TransactionUnitOfWork {
  private readonly queryRunner: QueryRunner;
  private transactionManager: EntityManager;
  private readonly connection: Connection;

  constructor() {
    this.connection = getConnection();
    this.queryRunner = this.connection.createQueryRunner();
  }

  async start(): Promise<void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    this.setTransactionManager();
  }

  setTransactionManager(): void {
    this.transactionManager = this.queryRunner.manager;
  }

  registerRepository<Entity>(
    repositry: EntitySchema<Entity>
  ): Repository<Entity> {
    return this.transactionManager.getRepository(repositry);
  }

  registerCustomRepository<T>(customRepository: ObjectType<T>): T {
    return this.transactionManager.getCustomRepository(customRepository);
  }

  async complete(work: () => void): Promise<void> {
    try {
      await work();
      await this.queryRunner.commitTransaction();
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release(); //release the used db connections.
      // await this.connection.close(); // close db connection
    }
  }
}
