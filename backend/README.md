# SignalDesk — Backend

FastAPI service for inbound enquiry handling, SOP keyword matching, and operational history.

**Status:** scaffold — not runnable yet.

## Contract

Implement against [../docs/product-contract.md](../docs/product-contract.md). Use `snake_case` for API and database fields.

## Planned layout

```
backend/
├── app/
│   ├── routers/      # HTTP routes
│   ├── services/     # Domain logic (SOP matcher, enquiry lifecycle)
│   └── ...           # models, schemas, config (to be added)
└── tests/            # pytest suite
```

## Planned stack (free, maintained)

- Python 3.11+
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/) + SQLite for local dev
- [pytest](https://pytest.org/) + [httpx](https://www.python-httpx.org/) for API tests

Dependency manifests and a runnable app will be added in the backend implementation phase.

## Parallel work

Own everything under `backend/`. Do not change `frontend/` or the product contract without syncing both tracks.
