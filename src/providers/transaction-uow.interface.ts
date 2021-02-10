export interface TransactionUnitOfWork {
  start(): Promise<void>;
  complete(work: () => void): Promise<void>;
  registerRepository(repositry);
  registerCustomRepository(customRepository);
}
