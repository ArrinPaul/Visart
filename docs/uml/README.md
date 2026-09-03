# UML Diagrams — How to Read Them

This codebase is not written in an object-oriented style — there are no classes, no inheritance hierarchies, and no interfaces in the traditional OOP sense. `class-diagram.md` is therefore an **architectural UML representation**: boxes represent logical modules (a `lib/` file, a data shape, or a cohesive group of functions), not literal TypeScript classes. Attributes shown are the key fields of the corresponding TypeScript type; "methods" shown are the module's exported functions.

- [`class-diagram.md`](class-diagram.md) — domain types and the `lib/` modules that operate on them, and how they relate.
- [`use-case-diagram.md`](use-case-diagram.md) — actors (Artisan, Buyer, Admin — none authenticated) and what each can do.
- [`entity-relationship-diagram.md`](entity-relationship-diagram.md) — the real Postgres schema (also duplicated in [DATABASE.md](../DATABASE.md) for convenience; this file is the canonical UML version).

All diagrams are Mermaid, renderable directly on GitHub or in any Mermaid-compatible viewer.
