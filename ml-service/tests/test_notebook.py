import json

from make_notebook import HERE, OUTPUT, SCRIPTS, build


def test_every_script_is_embedded_unchanged():
    sources = ["".join(cell["source"]) for cell in build()["cells"]]
    for name in SCRIPTS:
        expected = f"%%writefile {name}\n" + (HERE / name).read_text(encoding="utf-8")
        assert expected in sources


def test_committed_notebook_is_up_to_date():
    assert json.loads(OUTPUT.read_text(encoding="utf-8")) == build()
