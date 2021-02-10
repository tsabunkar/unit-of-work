export interface TransactionUnitOfWork {
  start(connection): Promise<void>;
  complete(work: () => void): Promise<void>;
  registerRepository(repositry);
  registerCustomRepository(customRepository);
}
