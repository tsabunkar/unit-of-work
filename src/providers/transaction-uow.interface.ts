export interface TransactionUnitOfWork {
  start(): Promise<void>;
  complete<T>(work: () => T | Promise<T>): Promise<T>;
  registerRepository(repositry);
  registerCustomRepository(customRepository);
}
