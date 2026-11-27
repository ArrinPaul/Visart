import numpy as np
import pytest

pytest.importorskip("sklearn")
pytest.importorskip("matplotlib")

from evaluate import calibration, parse_log, summary  # noqa: E402


def test_reads_the_training_output():
    log = ("images: {}\nmobilenet_v3_large head 1/3 loss 1.200 val macro-F1 0.500 (3s)\n"
           "mobilenet_v3_large fine-tune 1/10 loss 0.900 val macro-F1 0.700 (4s)\nnoise\n")
    assert parse_log(log) == {"mobilenet_v3_large": [(1.2, 0.5), (0.9, 0.7)]}


def test_calibration_error_is_the_weighted_gap():
    ece, rows = calibration([0.95, 0.95, 0.55, 0.55], [True, True, True, False])
    assert ece == pytest.approx(0.05)
    assert [r[2] for r in rows] == [2, 2]


def test_summary_of_perfect_predictions():
    truth = np.array([0, 1, 2, 0, 1, 2])
    result = summary(truth, np.eye(3)[truth] * 0.97 + 0.01)
    assert result["Accuracy"] == result["Macro F1"] == result["ROC-AUC (macro)"] == 1.0
