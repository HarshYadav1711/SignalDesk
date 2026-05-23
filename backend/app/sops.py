from dataclasses import dataclass


@dataclass(frozen=True)
class SOP:
    id: str
    title: str
    keywords: tuple[str, ...]
    suggested_response: str


SOPS: tuple[SOP, ...] = (
    SOP(
        id="sop-pricing",
        title="Pricing & Plans",
        keywords=("price", "pricing", "cost", "quote", "plan"),
        suggested_response=(
            "Thanks for your interest in SignalDesk. Our Starter plan is $29/mo "
            "for up to 500 enquiries, and Growth is $79/mo with SLA routing. "
            "I can send a comparison sheet — which team size are you evaluating for?"
        ),
    ),
    SOP(
        id="sop-refund",
        title="Refund & Cancellation",
        keywords=("refund", "cancel", "cancellation", "money back", "chargeback"),
        suggested_response=(
            "I can help with billing adjustments. Refunds for annual plans are "
            "reviewed within 5 business days. Please confirm the invoice ID and "
            "whether you'd prefer credit or a card reversal."
        ),
    ),
    SOP(
        id="sop-technical",
        title="Technical Support",
        keywords=("bug", "error", "broken", "not working", "crash", "login", "sync"),
        suggested_response=(
            "Sorry you're hitting issues. Please share the workspace ID and the "
            "last action before the error. Our playbook covers cache resets and "
            "connector re-auth — I'll walk you through the fastest fix."
        ),
    ),
    SOP(
        id="sop-billing",
        title="Billing & Invoices",
        keywords=("invoice", "bill", "billing", "charge", "payment", "receipt"),
        suggested_response=(
            "Billing copies are available under Settings → Billing. If a charge "
            "looks unexpected, send the last four digits of the card and invoice "
            "date — I'll reconcile against the ledger."
        ),
    ),
    SOP(
        id="sop-hours",
        title="Business Hours & Availability",
        keywords=("hours", "open", "schedule", "when", "availability", "holiday"),
        suggested_response=(
            "SignalDesk live support is Mon–Fri 9am–6pm IST. After hours, "
            "urgent escalations are monitored on-call. Would you like a callback "
            "slot tomorrow morning?"
        ),
    ),
)
