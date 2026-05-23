from app.sops import SOP, SOPS


def match_sop(message: str) -> SOP | None:
    normalized = message.lower()
    best: SOP | None = None
    best_score = 0

    for sop in SOPS:
        score = sum(1 for keyword in sop.keywords if keyword in normalized)
        if score > best_score:
            best_score = score
            best = sop

    return best if best_score > 0 else None
