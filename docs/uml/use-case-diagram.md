# Use Case Diagram

**Note on actors**: none of these are authenticated identities — see [AUTHENTICATION.md](../AUTHENTICATION.md). They represent roles-by-context (which page/flow someone is using), not accounts.

```mermaid
graph LR
    Artisan((Artisan))
    Buyer((Buyer))
    Admin((Admin))

    subgraph VISART["VISART System"]
        UC1[Create AI listing]
        UC2[Dictate listing via voice]
        UC3[Edit listing in workspace]
        UC4[View public product page]
        UC5[Listen to narrated story]
        UC6[Switch listing language]
        UC7[View authenticity audit]
        UC8[Submit buyer feedback / counterfeit report]
        UC9[Manage products - CRUD/publish]
        UC10[Moderate reviews]
        UC11[Manage artisans directory]
        UC12[Manage customer leads]
        UC13[View dashboard/analytics]
        UC14[Configure platform settings]
        UC15[View activity log]
    end

    Artisan --> UC1
    Artisan --> UC2
    Artisan --> UC3
    UC2 -.includes.-> UC1

    Buyer --> UC4
    Buyer --> UC5
    Buyer --> UC6
    Buyer --> UC7
    Buyer --> UC8
    UC4 -.includes.-> UC7

    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
```

## Notes
- `UC2` (voice dictation) is an `includes` extension of `UC1` (create listing) — it's an alternate input method for the same form, not a separate flow.
- `UC7` (authenticity audit) is generated automatically as part of `UC4` (viewing a product) — there is no separate "request an audit" action; every page view regenerates it.
- Because the system boundary has no real authentication, in practice a single unauthenticated visitor can perform every use case above, including all `Admin` ones, by navigating to `/admin` directly — the actor separation here reflects the *intended* UI role separation, not an enforced one. See [SECURITY.md](../SECURITY.md).
