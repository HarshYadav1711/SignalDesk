# SignalDesk Backend

Lightweight FastAPI service for inbound enquiry handling with asynchronous SOP keyword matching.

See the [root README](../README.md) for monorepo setup and the combined walkthrough video.

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

## Database: SQLite vs PostgreSQL

**Choice for this submission: SQLite** (`sqlite:///./signaldesk.db`).

| | SQLite | PostgreSQL |
|---|--------|------------|
| Setup | Zero config, file-based | Requires server/container |
| Concurrency | Fine for demo & single worker | Better for multi-worker production |
| Reviewer experience | Clone and run immediately | Extra infra step |

The schema uses SQLAlchemy models that work unchanged with PostgreSQL — set `DATABASE_URL=postgresql+psycopg://user:pass@localhost/signaldesk` for production.

### Schema reasoning

- **`enquiries`** — current enquiry state (status, matched SOP, suggested response).
- **`enquiry_events`** — append-only operational timeline (created, SOP matched, escalated, follow-ups).

This split keeps reads simple for `/history` while preserving a full audit trail without mutating past records.

## Celery vs FastAPI BackgroundTasks

**Choice: `BackgroundTasks`**

| | BackgroundTasks | Celery |
|---|-----------------|--------|
| Dependencies | None (in-process) | Broker (Redis/RabbitMQ) + worker process |
| Durability | Lost if process crashes mid-task | Tasks survive restarts |
| Fit here | Keyword SOP scan is fast (<50ms) | Overkill for internship scope |

Celery is the right upgrade when tasks are long-running, retriable, or must survive API restarts. For this assignment's keyword matcher, in-process background work is sufficient and keeps the repo easy to run.

## Structured logging

Logs are JSON lines to stdout with `event` keys such as `enquiry_created`, `task_processed`, `sop_matched`, and `escalation_triggered`.

## API tests

```bash
pytest -q
```

Also see `signaldesk.http` for REST Client / VS Code manual calls.

## Trade-offs & known limitations

- Background work is in-process — not durable across crashes.
- SOP matching is naive keyword overlap (no stemming, no priority rules beyond best score).
- No authentication (internal workflow service assumption).
- SQLite write locking under heavy concurrent load.
