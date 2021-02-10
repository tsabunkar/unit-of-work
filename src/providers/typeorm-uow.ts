import { TransactionUnitOfWork } from './transaction-uow.interface';
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

export class TypeOrmUnitOfWork implements TransactionUnitOfWork {
  private queryRunner: QueryRunner;
  private transactionManager: EntityManager;
  private readonly connection: Connection;

  constructor() {}

  async init() {
    let connection: Connection;

    console.log(
      'Any Previous Connection Instance',
      getConnectionManager().has('default')
    );

    if (!getConnectionManager().has('default')) {
      // ? load connection options from ormconfig or environment
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
    }
  }
}
