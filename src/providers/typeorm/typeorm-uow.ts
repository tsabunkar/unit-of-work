import {
  Connection,
  QueryRunner,
  EntityManager,
  getConnection,
  Repository,
  EntitySchema,
  ObjectType,
  getConnectionManager,
  getConnectionOptions,
  createConnection,
} from 'typeorm';
import { TransactionUnitOfWork } from '../transaction-uow.interface';

export class TypeOrmUnitOfWork implements TransactionUnitOfWork {
  private queryRunner: QueryRunner;
  private transactionManager: EntityManager;

  constructor() {}

  async init() {
    let connection: Connection;

    if (!getConnectionManager().has('default')) {
      // ? load connection options from ormconfig or environment of source
      const connectionOptions = await getConnectionOptions();
      connection = await createConnection(connectionOptions);
    } else {
      connection = getConnection();
    }

    this.queryRunner = connection.createQueryRunner();
  }

  async start(): Promise<void> {
    await this.init();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    this.setTransactionManager();
  }

  private setTransactionManager(): void {
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

  async complete<T>(work: () => T | Promise<T>): Promise<T> {
    try {
      const result = await work();
      await this.queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      console.error(error); // TODO: Logging can be better
      throw error;
    } finally {
      await this.queryRunner.release(); //release the used query Runner Instance.
    }
  }
}
