# Walkthrough video

**Watch or download:** [SignalDesk demo on Google Drive](https://drive.google.com/drive/folders/14_XA18zMDPUD7NCXxKcjZjohE8D6iYl2?usp=drive_link) — file: `SignalDesk.mp4`.

The video is hosted on Drive (not in git). This folder holds the recording guide only.

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
- Mention one deliberate choice (e.g. BackgroundTasks vs Celery, or mock-first frontend).

---

## Checklist (for re-recording)

- [ ] Video uploaded to the [Drive folder](https://drive.google.com/drive/folders/14_XA18zMDPUD7NCXxKcjZjohE8D6iYl2?usp=drive_link) or linked from the root [README](../../README.md)
- [ ] Recording follows the flow above (API create/poll + mobile tabs)
- [ ] Audio is audible; UI text is readable at 1080p
- [ ] API and mobile app segments are both included
