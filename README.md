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

# unit-of-work-lib

- Unit of Work pattern is used to group one or more operations (usually database operations) into a single transaction or “unit of work”, so that all operations either pass or fail as one.
- for example of we want to save/POST data in sequential order but transactions fail in while saving the data in some table then ==> How we will handle this transaction ? (Instead of re-writting code -> Create a design pattern/ Helper functions which can be used by other feature modules while performing db transactions )
- NOTE: Managing database transactions in your service layer as a code smell.

---
