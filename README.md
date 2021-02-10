# unit-of-work-lib

- Unit of Work pattern is used to group one or more operations (usually database operations) into a single transaction or “unit of work”, so that all operations either pass or fail as one.
- for example of we want to save/POST data in sequential order but transactions fail in while saving the data in some table then ==> How we will handle this transaction ? (Instead of re-writting code -> Create a design pattern/ Helper functions which can be used by other feature modules while performing db transactions )
- NOTE: Managing database transactions in your service layer as a code smell.
- Implemented for countries domain

- Ref: https://jideowosakin.com/unit-of-work-pattern-in-typescript/

---

# Step to Deploy Typescript Project in npm registry

- add .npmignore file
- $ tsc (on root project, Also npm i -g typescript)
- $ npm publish

- Ref: https://www.tsmean.com/articles/how-to-write-a-typescript-library/
