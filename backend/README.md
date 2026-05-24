# SignalDesk — Backend

FastAPI enquiry API with background SOP keyword matching and operational history.

**Full documentation:** [../README.md](../README.md) (architecture, API examples, design rationale).

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- http://127.0.0.1:8000/docs — OpenAPI  
- `pytest -q` — tests  
- [signaldesk.http](signaldesk.http) — REST Client samples  
- [.env.example](.env.example) — optional configuration  

Domain definitions: [../docs/product-contract.md](../docs/product-contract.md)
