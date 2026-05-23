# Combined walkthrough script (~3 minutes)

Use this script when recording `docs/walkthrough.mp4` for reviewers.

## 1. Intro (15s)

- "SignalDesk is a monorepo: FastAPI enquiry workflow plus an Expo mobile ops dashboard."
- Show repo folders: `backend/`, `frontend/`, `mock/`.

## 2. Backend demo (90s)

1. Start API: `uvicorn app.main:app --reload`
2. Open http://127.0.0.1:8000/docs
3. `GET /health` — show database connected
4. `POST /enquiry` with a **pricing** message — note `202 Accepted` and immediate response
5. `GET /enquiry/{id}/history` — refresh until `matched` + `sop_matched` event
6. `POST /enquiry` with "hello" only — show **auto-escalation** in history
7. `POST .../follow-up` and `POST .../escalate` on an existing id
8. Terminal: point at JSON log lines (`enquiry_created`, `sop_matched`, `escalation_triggered`)

## 3. Frontend demo (75s)

1. `npx expo start` → open on device/simulator
2. **Home** — metrics and priority queue
3. **Leads** → tap a row → **Conversation Detail** (timeline + suggested response)
4. **Escalations** → open escalated thread
5. **Follow-ups** — due times
6. Briefly open `frontend/mock/leads.json` — API-ready shape

## 4. Closing (30s)

- SQLite for easy review; PostgreSQL for production concurrency
- BackgroundTasks vs Celery trade-off
- Mobile uses mock data only by design
- Limitations: in-process tasks, keyword-only SOPs, no auth

## Deliverable

Place the recording at:

- `docs/walkthrough.mp4`, or
- Upload unlisted to YouTube/Vimeo and paste the link at the top of this file.
