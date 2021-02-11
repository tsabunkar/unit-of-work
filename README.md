# Motivation

- Improvise microservice(s) architecture layer by introducing Unit of Work design pattern in-order to solve common problem related to handling database transactions

# UoW Description

- Problem - Irregularity of Handling database transaction in Service Layer via ORM
- Solution - Using Design Pattern : Unit Of Work (Group one or many operation/work into Single Transaction as unit)
- Library Responsibility -
  - Handles Database transaction operations like- create connections, commit, rollback, release connection, etc
- Benefits of using this Library -
  - Layered Architecture
  - Uniformity of Code Guaranteed
  - Error Handling taken care
  - Plug-and-play (just import)
  - Solves Concurrency Problem
  - Structures your database transactions flow
  - Removes Code-smell i.e- Managing database transaction in Service Layer

# unit-of-work

- Unit of Work pattern is used to group one or more operations (usually database operations) into a single transaction or “unit of work”, so that all operations either pass or fail as one.
- for example of we want to save/POST data in sequential order but transactions fail in while saving the data in some table then ==> How we will handle this transaction ? (Instead of re-writting code -> Create a design pattern/ Helper functions which can be used by other feature modules while performing db transactions )
- NOTE: Managing database transactions in your service layer as a code smell.

# Usage

```ts
import { getCustomRepository, getConnection } from 'typeorm'; // ❌ Anti-pattern <= Handling database transaction in Service Layer (Code-smell)
@Injectable()
export class CountriesService {
    async createCountry(country: Countries): Promise<string> {
        const connection = getConnection(); // ❌ Manually handling Connections, queryRunner, commits, rollbacks
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {                               // ❌ Irregularity in Error Handling
          await queryRunner.manager.getRepository(Countries).save(country);
          await queryRunner.commitTransaction();
        } catch (err) {
          await queryRunner.rollbackTransaction();
        } finally {                         // ❌ Unstructured flow
          await queryRunner.release();
        }
        return;
}

```

> Using unit-of-work utility (Coding done right !!)

```ts
import {TransactionFactory} from 'unit-of-work'; // ✅  Design-Pattern <= Using UoW (Clean Code)
@Injectable()
export class CountriesService {
   constructor(
     private transactionFactory: TransactionFactory
     ) {}

    async createCountry(country: Countries): Promise<string> {
      const transaction = this.transactionFactory.registerORM('typeorm'); // ✅ Register your ORM Vendor

      await transaction.start(); // ✅ Start unit of work

      const work = () => { // ✅ Mention all your work - under this function
        const countriesRepository = transaction.registerRepository(Countries);
        countriesRepository.save(country);
      };

       transaction.complete(work); // ✅ Complete your work 😉
       return;
}

```

> Another Example of handling ton amount of work together

```ts
import { TransactionFactory } from 'unit-of-work'; // ✅  Design-Pattern <= Using UoW (Clean Code)
@Injectable()
export class CountriesService {
  constructor(private transactionFactory: TransactionFactory) {}

  async createBulkCountries(countries: Countries[]): Promise<string> {
    const transaction = this.transactionFactory.registerORM('typeorm');

    await transaction.start();

    const work = () => {
      const countriesRepository = transaction.registerRepository(Countries);
      for (const country of countries) {
        countriesRepository.save(country); // Saving list of countries
      }
    };

    transaction.complete(work);
    return;
  }
}
```
