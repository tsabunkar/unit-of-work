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
  private connection: Connection;

  constructor() {
    console.log('INSIDE CONSTRUCTOR OF TypeOrmUnitOfWork');
    // this.connection = getConnection();
    // this.queryRunner = this.connection.createQueryRunner();
  }

  async start(connection): Promise<void> {
    // console.log(
    //   'BEFORE CONNECTION EST*****',
    //   this.connection,
    //   'Boolean value for - getConnectionManager().has("default") ',
    //   getConnectionManager().has('default')
    // );
    // if (!getConnectionManager().has('default')) {
    //   // ? load connection options from ormconfig or environment
    //   // const connectionOptions = await getConnectionOptions();
    //   this.connection = await createConnection({
    //     type: 'postgres',
    //     host: '172.17.0.2',
    //     port: 5432,
    //     username: 'postgres',
    //     password: 'root',
    //     database: 'dev',
    //     entities: ['dist/**/*.entity{.ts,.js}', 'dist/entity/entities/*.js'],
    //     synchronize: false,
    //     logging: true,
    //   });
    // } else {
    //   this.connection = getConnection();
    // }

    // console.log('AFTER CONNECTION EST*****', this.connection);
    // this.queryRunner = this.connection.createQueryRunner();
    // console.log('----------------');

    this.queryRunner = connection.createQueryRunner();

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
      work();
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
