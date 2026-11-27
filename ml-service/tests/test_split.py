from split import assign_splits


def rows(craft, objects, per_object=3):
    return [{"file": f"images/{craft}/{craft}-{o}/{i}.jpg", "class": craft, "object_id": f"{craft}-{o}"}
            for o in range(objects) for i in range(per_object)]


def by_object(result, data):
    found = {}
    for row in data:
        found.setdefault(row["object_id"], set()).add(result[row["file"]])
    return found


def test_all_photos_of_an_object_share_a_split():
    data = rows("wood", 40)
    assert all(len(s) == 1 for s in by_object(assign_splits(data, {}), data).values())


def test_every_class_gets_roughly_70_15_15():
    data = rows("wood", 100, 1) + rows("metal", 100, 1)
    result = assign_splits(data, {})
    for craft in ("wood", "metal"):
        values = [result[r["file"]] for r in data if r["class"] == craft]
        assert 66 <= values.count("train") <= 74
        assert 12 <= values.count("val") <= 18
        assert 12 <= values.count("test") <= 18


def test_same_input_gives_same_split():
    data = rows("wood", 30)
    assert assign_splits(data, {}) == assign_splits(list(reversed(data)), {})


def test_earlier_assignments_never_move():
    old = rows("wood", 30)
    first = assign_splits(old, {})
    more = old + rows("wood", 60)[len(old):]
    extra_photo = {"file": "images/wood/wood-0/new.jpg", "class": "wood", "object_id": "wood-0"}
    second = assign_splits(more + [extra_photo], first)
    assert all(second[f] == s for f, s in first.items())
    assert second[extra_photo["file"]] == first[old[0]["file"]]
