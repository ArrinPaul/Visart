# Project Documentation

Start with the top-level [../README.md](../README.md) for a project overview and local setup. This directory is the engineering reference for maintaining and extending VISART.

**Read [SECURITY.md](SECURITY.md) and [AUTHENTICATION.md](AUTHENTICATION.md) early** — this codebase has real, currently-unfixed security gaps (no admin auth, fully public database write access) that should inform any decision about where/how to deploy it.

## Getting Started
- [../README.md](../README.md) — overview, tech stack, local setup
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) — how to add/modify features, schema changes

## Architecture
- [ARCHITECTURE.md](ARCHITECTURE.md) — system overview, layers, demo-mode vs. real-mode
- [CODEBASE_MAP.md](CODEBASE_MAP.md) — directory-by-directory map, change-risk table
- [DATA_FLOW.md](DATA_FLOW.md) — request-level data flow for each major pipeline
- [USER_FLOWS.md](USER_FLOWS.md) — end-to-end journeys (artisan, buyer, admin)
- [FEATURE_DEPENDENCIES.md](FEATURE_DEPENDENCIES.md) — what depends on what, change-impact table

## Requirements
- [REQUIREMENTS.md](REQUIREMENTS.md) — functional + non-functional requirements (inferred from implementation)
- [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md) — requirement → code → data mapping

## Features
- [features/ai-listing-generation.md](features/ai-listing-generation.md)
- [features/fair-pricing.md](features/fair-pricing.md)
- [features/heritage-storytelling-and-tts.md](features/heritage-storytelling-and-tts.md)
- [features/translation.md](features/translation.md)
- [features/authenticity-verification.md](features/authenticity-verification.md)
- [features/artisan-workspace.md](features/artisan-workspace.md)
- [features/admin-cms.md](features/admin-cms.md)

## UML
- [uml/README.md](uml/README.md) — how to read the diagrams
- [uml/class-diagram.md](uml/class-diagram.md)
- [uml/use-case-diagram.md](uml/use-case-diagram.md)
- [uml/entity-relationship-diagram.md](uml/entity-relationship-diagram.md)

## APIs & Database
- [API.md](API.md)
- [DATABASE.md](DATABASE.md)

## Security
- [AUTHENTICATION.md](AUTHENTICATION.md)
- [SECURITY.md](SECURITY.md)

## Testing & Operations
- [TESTING.md](TESTING.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [ENVIRONMENT.md](ENVIRONMENT.md)
- [ERROR_HANDLING.md](ERROR_HANDLING.md)

## Maintenance
- [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)
- [adr/](adr/) — architectural decision records

## Documentation Maintenance
```
CODE CHANGE + DOCUMENTATION CHANGE = COMPLETE CHANGE
```
See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md#documentation-maintenance-rule) for specifics on what tends to go stale in this codebase.
