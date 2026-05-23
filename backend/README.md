# SignalDesk — Backend

FastAPI service for inbound enquiry handling, asynchronous SOP keyword matching, and operational history.

See the [product contract](../docs/product-contract.md) for domain definitions shared with the frontend track.

## Quick start

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API: http://127.0.0.1:8000
- OpenAPI docs: http://127.0.0.1:8000/docs
- Tests: `pytest -q`
- Manual requests: [signaldesk.http](signaldesk.http) (VS Code REST Client / similar)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness + database connectivity |
| `POST` | `/enquiry` | Create enquiry; queue background SOP matching |
| `POST` | `/enquiry/{id}/follow-up` | Append customer message; re-queue matching |
| `POST` | `/enquiry/{id}/escalate` | Manual escalation with reason |
| `GET` | `/enquiry/{id}/history` | Enquiry snapshot + timeline events |

## Project layout

```
backend/
├── app/
│   ├── main.py              # FastAPI app, lifespan, validation handler
│   ├── config.py            # Settings (DATABASE_URL, log level)
│   ├── database.py          # Engine, session, init_db
│   ├── models.py            # SQLAlchemy Enquiry + EnquiryEvent
│   ├── schemas.py           # Pydantic request/response models
│   ├── sops.py              # Five hardcoded SOP playbooks
│   ├── logging_config.py    # Structured JSON logs
│   ├── exceptions.py        # Domain errors
│   ├── routers/             # HTTP layer
│   ├── repositories/        # Persistence access
│   ├── services/            # Business logic + SOP matcher
│   └── background/          # BackgroundTasks worker entrypoints
├── tests/
├── signaldesk.http
└── requirements.txt
```

## Database: SQLite vs PostgreSQL

**Choice for this project: SQLite** (`sqlite:///./signaldesk.db` by default).

| | SQLite | PostgreSQL |
|---|--------|------------|
| Setup | Zero config, file-based | Requires server or container |
| Local dev | Clone and run immediately | Extra infrastructure |
| Concurrency | Fine for demo and single worker | Better for multi-worker production |

SQLAlchemy models work unchanged with PostgreSQL — set `DATABASE_URL=postgresql+psycopg://user:pass@localhost/signaldesk` when you outgrow SQLite.

### Schema

- **`enquiries`** — current enquiry state (status, matched SOP, suggested response).
- **`enquiry_events`** — append-only operational timeline.

## Background processing

SOP matching runs in **FastAPI `BackgroundTasks`** after create and follow-up. This keeps the stack simple (no Redis/Celery) and is appropriate for fast, in-process keyword matching.

Flow:

1. `POST /enquiry` persists the record and returns `processing: true`.
2. Background task sets status to `processing`, then scans message text against five SOPs.
3. On match → `matched` + suggested response + timeline events.
4. On no match → `escalated` + `auto_escalated` event.

Each task opens its own database session so request lifecycle and worker lifecycle stay isolated.

## Structured logging

Logs are JSON lines on stdout with an `event` field, for example:

- `enquiry_created`
- `follow_up_scheduled`
- `sop_matched`
- `escalation_triggered`
- `task_processed`

## Error handling

| Situation | HTTP |
|-----------|------|
| Validation failure | `422` with `detail` message |
| Unknown enquiry id | `404` |
| Duplicate manual escalation | `409` |
| Follow-up / escalate on closed or processing enquiry | `409` |

## Celery vs BackgroundTasks

**BackgroundTasks** is used because SOP matching is quick, synchronous-friendly work. **Celery** would add Redis/broker operations without benefit at this scope. If matching later calls slow external systems, move processing to a queue and keep the same service methods.
