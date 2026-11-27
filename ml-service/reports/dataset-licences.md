# Dataset licence check (week 1)

Checked on 2026-11-26 from each site's own metadata.

## Used for the baseline classifier

| Source | Licence | Note |
|---|---|---|
| Cleveland Museum of Art Open Access | CC0 | Museum photos |
| The Met Open Access | CC0 | Museum photos |
| Openverse results | CC0, public domain, CC BY, CC BY-SA per image | Author recorded in the manifest |
| Wikimedia Commons | Same set, per file | Author recorded in the manifest |

CC BY and CC BY-SA images need credit if we publish them. The author and source of each image are in
`data/manifest.csv`. We do not redistribute the photos.

## Pottery handmade vs machine-made (stretch goal): not cleared

| Item | Licence found |
|---|---|
| GitHub `DSLamia/AI-Driven-Pottery-Classification` | None |
| Hugging Face `eddie-cui/Pottery-Like` (3,851 handmade) | MIT |
| Hugging Face `groove-net/kitchenware_5000_split` (522 machine-made) | None stated |
| 225 supplementary images | Not identified |

Do not use the machine-made images unless their owner grants permission.

There is a second problem. In that project, handmade and machine-made photos come mostly from
different sources, so a model can score very high by recognising the source instead of how the item
was made. Its reported 99% accuracy should not be taken as evidence the task is solved. If we try the
stretch goal, collect both kinds of pottery ourselves in the same conditions.
