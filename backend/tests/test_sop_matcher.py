from app.services.sop_matcher import match_sop


def test_matches_pricing():
    sop = match_sop("What is your pricing for teams?")
    assert sop is not None
    assert sop.id == "sop-pricing"


def test_matches_refund():
    sop = match_sop("I want a refund on my subscription")
    assert sop is not None
    assert sop.id == "sop-refund"


def test_no_match():
    assert match_sop("hello there") is None
