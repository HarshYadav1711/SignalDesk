# SignalDesk — Backend

FastAPI enquiry workflow: store inbound messages, keyword-match SOP playbooks, append-only timeline, background matching after create or follow-up.

Overview, architecture, and why we picked BackgroundTasks/SQLite: **[../README.md](../README.md)**.

## Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

| Resource | Link |
|----------|------|
| OpenAPI | http://127.0.0.1:8000/docs |
| Tests | `pytest -q` |
| REST samples | [signaldesk.http](signaldesk.http) |
| API reference | [../docs/api/README.md](../docs/api/README.md) |
| Domain contract | [../docs/product-contract.md](../docs/product-contract.md) |
| Config | [.env.example](.env.example) |

## Layout

```
app/
├── main.py              # App factory, logging middleware, exception handlers
├── routers/             # /health, /enquiry/*
├── services/            # EnquiryService, SopMatcherService
├── repositories/        # SQLAlchemy access
├── background/        # BackgroundTasks SOP runner
├── models.py            # Enquiry, EnquiryEvent
└── sops.py              # Playbook catalog
```
