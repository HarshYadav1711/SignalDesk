from app.services.sop_matcher import SopMatcherService


def test_match_pricing_keywords():
    matcher = SopMatcherService()
    sop = matcher.match("Can you send pricing for three seats?")
    assert sop is not None
    assert sop.id == "sop-pricing"


def test_match_is_case_insensitive():
    matcher = SopMatcherService()
    sop = matcher.match("I need a REFUND please")
    assert sop is not None
    assert sop.id == "sop-refund"


def test_no_match_returns_none():
    matcher = SopMatcherService()
    assert matcher.match("Hello, just checking in.") is None


def test_first_sop_wins_when_multiple_keywords():
    matcher = SopMatcherService()
    sop = matcher.match("I have a billing question about my invoice and pricing")
    assert sop is not None
    assert sop.id == "sop-pricing"
