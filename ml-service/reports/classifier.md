# Craft classifier, 2026-11-27

**Data:** openly licensed web and museum photos (Wikimedia Commons, Cleveland Museum of Art,
The Met). Labels come from search terms and collection types and were not all hand-checked.
**These numbers are not accuracy on artisan phone photos**, which has not been measured.

Images: train 977, validation 209, test 208.

## Model comparison (validation)

| Architecture | Macro-F1 |
|---|---|
| mobilenet_v3_large | 0.797 |
| efficientnet_b0 | 0.741 |

Chosen: **mobilenet_v3_large**.

## Test set (chosen model, evaluated once)

Macro-F1 **0.716**, accuracy 0.721.

| Class | Precision | Recall | F1 | Images |
|---|---|---|---|---|
| pottery | 0.756 | 0.705 | 0.729 | 44 |
| wood | 0.553 | 0.618 | 0.583 | 34 |
| textile | 0.771 | 0.902 | 0.831 | 41 |
| metal | 0.682 | 0.682 | 0.682 | 44 |
| bamboo | 0.838 | 0.689 | 0.756 | 45 |

Confusion matrix (rows are true classes):

| | pottery | wood | textile | metal | bamboo |
|---|---|---|---|---|---|
| **pottery** | 31 | 5 | 2 | 6 | 0 |
| **wood** | 8 | 21 | 0 | 3 | 2 |
| **textile** | 0 | 2 | 37 | 1 | 1 |
| **metal** | 1 | 5 | 5 | 30 | 3 |
| **bamboo** | 1 | 5 | 4 | 4 | 31 |

## Uncertain threshold

Chosen on validation: 0.726. On test, 64% of photos get an answer, and 83% of those answers are right. The rest are `uncertain`.
Photos of things outside the five classes have not been tested.
