# Motivation

Improvise microservice(s) architecture layer by introducing Unit of Work design pattern in-order to solve common problem related to handling database transactions

# About

- Problem- Irregularity of Handling database transaction in Service Layer via ORM (like- TypeORM, Sequelize, etc)
- Solution - Using Design Pattern : Unit Of Work (Group one or many operation/work into Single Transaction as unit)
- Library Responsibility -
  - Handles Database transaction operations like- create connections, commit, rollback, release connection, etc

# Philosophy

This library has been developed with main goals and provide benefits:

- Loose Coupling between Service/Repositry Layer and ORM Library.
- Layered Architecture.
- Uniformity of Code Guaranteed.
- Error Handling taken care.
- Plug-and-play (just import).
- Solves Concurrency Problem.
- Structures your database transactions flow.
- Removes Code-smell i.e- Managing database transaction in Service Layer.
- Allow Typescript/JavaScript developers to write code that adheres to the SOLID principles.
- Provide a state of the art development experience.
- Facilitate and encourage the adherence to the best OOP practices.

# Description

- Unit of Work pattern is used to group one or more operations (usually database operations) into a single transaction or “unit of work”, so that all operations either pass or fail as one.
- for example of we want to save/POST data in sequential order but transactions fail in while saving the data in some table then - Q) How we will handle this transaction ? (Instead of re-writting code -> Create a design pattern/ Helper functions which can be used by other feature modules while performing db transactions )
- NOTE: Managing database transactions in your service layer and tight copuling with ORM tool is clearly a code smell.

# Installation

You can get the latest release and the type definitions using npm:

```
$ npm install unit-of-work --save
```

# Basic Usage

Let us first see how typically we write code to save a object

```ts
import { getCustomRepository, getConnection } from 'typeorm'; // ❌ Anti-pattern
//i,e- Handling database transaction in Service Layer thus tightly coupled
// b/w Service Layer and TyperORM library (Code-smell)
@Injectable()
export class CountriesService {
  async createCountry(country: Countries): Promise<string> {
    const connection = getConnection(); // ❌ Manually handling Connections, queryRunner, commits, rollbacks (should have good-knowldge)
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ❌ Irregularity in Error Handling
      await queryRunner.manager.getRepository(Countries).save(country);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      // ❌ Unstructured & Uncertainty in flow
      await queryRunner.release();
    }
    return;
  }
}
```

Now using unit-of-work utility I would urge to follow

```ts
import { TransactionFactory } from 'unit-of-work'; // ✅  Design-Pattern <= Using UoW (loosely coupled)
@Injectable()
export class CountriesService {
  constructor(private transactionFactory: TransactionFactory) {}

  async createCountry(country: Countries): Promise<string> {
    const transaction = this.transactionFactory.registerORM('typeorm'); // ✅ Register your ORM Vendor

    await transaction.start(); // ✅ Start unit of work

    const work = () => {
      // ✅ Mention all your work - under this function
      const countriesRepository = transaction.registerRepository(Countries);
      countriesRepository.save(country);
    };

    transaction.complete(work); // ✅ Complete your work 😉
    return;
  }
}
```

Don't forget to provide **TransactionFactory** in providers array of you Module file

```ts
import { TransactionFactory } from 'unit-of-work';
@Module({
  providers: [TransactionFactory],
})
export class CountriesModule {}
```

Let us look into another example of handling ton 🏋🏼 amount of work together

```ts
import { TransactionFactory } from 'unit-of-work';
@Injectable()
export class CountriesService {
  constructor(private transactionFactory: TransactionFactory) {}

  async createBulkCountries(countries: Countries[]): Promise<string> {
    const transaction = this.transactionFactory.registerORM('typeorm');

    await transaction.start();

    const work = () => {
      const countriesRepository = transaction.registerRepository(Countries);
      for (const country of countries) {
        countriesRepository.save(country); // Saving list of countries object
      }
    };

    transaction.complete(work);
    return;
  }
}
```

# Golden Rules 🌟

To Sum-up : This Library provide 3 Golden 🥇 Methods i.e-

```ts
// 1. Register your ORM Vendor
const transaction = this.transactionFactory.registerORM('<vendor_name>'); // typeorm or sequelize

// 2. Start your transaction
await transaction.start();

// 3.1 Mention all your work here
const work = () => {
  // logic
};

// 3.2 Complete your transaction
await transaction.complete(work);
```

## Support

If you are experience any kind of issues we will be happy to help. You can report an issue using the issues page or the chat. You can also ask questions at Stack overflow using the unit-of-work tag.

If you want to share your thoughts with the development team or join us you will be able to do so using the official the mailing list. You can check out the wiki to learn more about unit-of-work internals.

## Maintainers

- Tejas Sabunkar <tsabunkar@gmail.com>

## License

License under the MIT License (MIT)

Copyright © 2021 Tejas Sabunkar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
