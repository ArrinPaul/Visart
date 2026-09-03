# Class Diagram (Architectural)

See [README.md](README.md) for how to read this — boxes are logical modules/types, not literal OOP classes.

```mermaid
classDiagram
    class VisartInput {
        +string productName
        +string material
        +number productionCost
        +string timeRequired
        +string location
        +string specialDetails
        +string imageBase64
        +string mimeType
    }

    class VisartGeneration {
        +ProductBlock product
        +PricingBlock pricing
        +MarketingBlock marketing
        +TranslationsBlock translations
        +StoryBlock story
        +ReadinessBlock readiness
    }

    class ProductRecord {
        +string id
        +string artisan_id
        +string image_url
        +ProductInputData input_data
        +VisartGeneration generated_data
        +boolean is_published
        +ArtisanRef artisan
    }

    class AuthenticityAudit {
        +string productId
        +int overallScore
        +Verdict verdict
        +int materialIntegrityScore
        +int techniqueIntegrityScore
        +int pricingIntegrityScore
        +CraftAuthenticityMarker[] authenticMarkers
        +string[] counterfeitWarningSigns
        +SpotAFakeGuide spotAFakeGuide
        +int communityTrustScore
    }

    class CustomerFeedback {
        +string id
        +string productId
        +string userName
        +int rating
        +FeedbackAuthenticityRating authenticityRating
        +string comment
        +CraftChecks craftChecks
        +boolean flaggedAsFake
        +GeminiAnalysis geminiAnalysis
    }

    class VisartGenerationService {
        <<lib/ai/visart.ts>>
        +generateVisartListing(input) VisartGeneration
        +getMockGeneration(input) VisartGeneration
        -getCandidateModels() string[]
        -isTransientError(msg) boolean
    }

    class AuthenticityService {
        <<lib/ai/authenticity.ts>>
        +generateAuthenticityAudit(product, feedbacks) AuthenticityAudit
        +getMockAuthenticityAudit(product, feedbacks) AuthenticityAudit
        +analyzeFeedbackWithGemini(input, product) RiskResult
    }

    class ProductRepository {
        <<lib/supabase/products.ts>>
        +saveProduct(params) ProductRecord
        +getProductById(id) ProductRecord
        +getRecentProducts() ProductRecord[]
        +updateProductData(id, patch) ProductRecord
    }

    class FeedbackRepository {
        <<lib/supabase/feedback.ts>>
        +getProductFeedback(productId) CustomerFeedback[]
        +submitProductFeedback(input) CustomerFeedback
    }

    class AdminRepository {
        <<lib/supabase/admin.ts>>
        +getAdminDashboardStats() AdminDashboardStats
        +getAdminProductsCMS() AdminProductSummary[]
        +getArtisansList() ArtisanProfile[]
        +getCustomerLeads() CustomerLead[]
        +getAllReviewsCMS() ReviewModerationItem[]
        +getAdminSettings() AdminSystemSettings
        +logAdminActivity(...) ActivityLog
    }

    class SupabaseClientFactory {
        <<lib/supabase/client.ts + config.ts>>
        +isSupabaseConfigured() boolean
        +getSupabaseClient() SupabaseClient
    }

    VisartGenerationService --> VisartInput : consumes
    VisartGenerationService --> VisartGeneration : produces
    ProductRepository --> ProductRecord : reads/writes
    ProductRepository --> VisartGeneration : embeds as generated_data
    ProductRepository --> SupabaseClientFactory : uses
    AuthenticityService --> ProductRecord : reads
    AuthenticityService --> CustomerFeedback : reads
    AuthenticityService --> AuthenticityAudit : produces
    FeedbackRepository --> CustomerFeedback : reads/writes
    FeedbackRepository --> AuthenticityService : calls analyzeFeedbackWithGemini
    FeedbackRepository --> SupabaseClientFactory : uses
    AdminRepository --> ProductRepository : delegates to
    AdminRepository --> FeedbackRepository : delegates to
    AdminRepository --> SupabaseClientFactory : uses
```

Note: `AdminRepository` is named after its file ([`lib/supabase/admin.ts`](../../lib/supabase/admin.ts)) but, per [DATABASE.md](../DATABASE.md), most of its own domain data (artisans directory status, customer leads, activity log, settings) is `localStorage`-backed, not Supabase-backed — its dependency on `SupabaseClientFactory` above reflects only the parts it delegates to `ProductRepository`/`FeedbackRepository`.
