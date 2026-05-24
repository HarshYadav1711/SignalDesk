# Walkthrough video

End-to-end demo for reviewers. Place the final recording here:

**`docs/walkthrough/walkthrough.mp4`**

(Alternatively, `walkthrough.webm` or `walkthrough.mov` — update the link in the root [README](../../README.md) if you use a different filename.)

---

## Suggested flow (3–5 minutes)

1. **Start the API** — `uvicorn app.main:app --reload --port 8000` from `backend/`.
2. **Create a matching enquiry** — `POST /enquiry` with pricing keywords (e.g. *quote*, *pricing*). Show `201` and `processing: true`.
3. **Poll history** — `GET /enquiry/{id}/history` until `status` is `matched` and `suggested_response` is populated.
4. **Create a non-matching enquiry** — generic message with no SOP keywords; show auto-escalation in history.
5. **Open the mobile app** — `npm start` in `frontend/`; walk through:
   - Home → KPIs, priority queue, activity
   - Leads → inbox cards
   - Escalations → reasons and priority
   - Follow-ups → overdue / due today / upcoming
   - Conversation detail → message, suggested SOP response, timeline
6. **Optional API actions** — follow-up or manual escalate; show `409` if you repeat escalate on the same enquiry.

---

## Recording tips

- Use a simulator or device at a consistent size (e.g. iPhone 15).
- Keep the same Northline HVAC mock scenario as in `frontend/mock/` for continuity with [screenshots](../screenshots/README.md).
- Narrate one design choice briefly (e.g. background SOP matching vs Celery, or mock-first frontend).

---

## Before you submit

- [ ] Video file added under `docs/walkthrough/`
- [ ] Root README walkthrough link points to your file
- [ ] Audio is audible; UI text is readable at 1080p
- [ ] API and app segments are both included
