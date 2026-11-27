# Collecting the dataset

Goal for week 1: **600 photos logged** across the team. Overall goal: 300 or more per class.

## Classes

| Class | Include | Leave out |
|---|---|---|
| `pottery` | Terracotta, clay and ceramic pots, lamps, figures | Plastic or metal look-alikes |
| `wood` | Carved items, wooden toys, utensils, boxes | Bamboo and cane items |
| `textile` | Sarees, shawls, stoles, woven or embroidered cloth | Leather, paper |
| `metal` | Brass, bronze, copper, bidri items | Metallic-painted wood or plastic |
| `bamboo` | Baskets, mats, cane furniture and decor | Solid wood items |

If one photo shows several kinds of item, do not use it.

## Folders

    ml-service/data/images/<class>/<object_id>/<file>.jpg

- One folder per physical object. Name it with your initials and a number, for example `ap-014`.
  All photos of an object must be in that one folder, or the test score will be too high.
- Take 3 to 8 photos of each object: different angles, backgrounds and light.
- At least 224 pixels on the short side. JPEG, PNG or WebP (set an iPhone to "Most Compatible").
- No faces, names, phone numbers or price tags with personal details.

## Source and licence

Run this after adding photos:

    .venv\Scripts\python manifest.py

It adds new files to `data/manifest.csv`, counts them and lists problems. Fill in two columns:

| Column | Example |
|---|---|
| `source` | `own photo`, or the page address |
| `licence` | `own`, `owner permission`, `CC BY 4.0` |
| `author` | Who to credit (required for CC BY and CC BY-SA) |

Do not use pictures from shopping sites or search results unless their licence clearly allows it.

## Downloaded photos

`python collect.py` adds openly licensed photos from Wikimedia Commons, the Cleveland Museum of
Art and The Met, with source, licence and author filled in. They are training data only: they are
mostly not artisan phone photos, and search results contain wrong items. Only Wikimedia Commons is
switched on: on 2026-11-26 The Met search returned 410, Flickr and rawpixel refused automated
downloads, and the Cleveland image server took 30 to 60 seconds per photo. Keep our own phone photos
for the final test set.

## Sharing

`ml-service/data/` is not stored in git. Keep one shared drive folder with the same layout, and run
the script on the merged copy before the weekly check. Keep `manifest.csv` with the photos.
