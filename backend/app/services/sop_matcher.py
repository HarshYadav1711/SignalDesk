from app.sops import SOP, SOPS


class SopMatcherService:
    """Keyword-only SOP matching (case-insensitive substring). First match wins."""

    def match(self, text: str) -> SOP | None:
        normalized = text.lower()
        for sop in SOPS:
            if any(keyword in normalized for keyword in sop.keywords):
                return sop
        return None
