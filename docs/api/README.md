# SignalDesk API reference

Local base URL: `http://127.0.0.1:8000`

Live OpenAPI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) · REST Client file: [backend/signaldesk.http](../../backend/signaldesk.http)

Errors: `{ "detail": "<message>" }` (validation `422` may return a structured `detail` array).

---

## Health

### `GET /health`

Check API and database connectivity.

**Status codes**

| Code | Meaning |
|------|---------|
| `200` | Service healthy |

**Example response**

```json
{
  "status": "ok",
  "service": "SignalDesk API",
  "database": "connected"
}
```

---

## Create enquiry

### `POST /enquiry`

Create enquiry, persist message, append timeline event, queue background SOP keyword matching.

**Request body**

```json
{
  "customer_name": "Sarah Chen",
  "channel": "whatsapp",
  "subject": "Quote for AC installation",
  "message": "Need a quote for pricing and install on a 3-ton unit."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `customer_name` | string | yes | 1–120 characters |
| `channel` | string | yes | `email`, `whatsapp`, `web_chat`, `phone` |
| `subject` | string | yes | 1–200 characters |
| `message` | string | yes | Used for SOP keyword matching |

**Status codes**

| Code | Meaning |
|------|---------|
| `201` | Enquiry created; matching queued |
| `422` | Validation error |

**Example response (`201`)**

```json
{
  "enquiry": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_name": "Sarah Chen",
    "channel": "whatsapp",
    "subject": "Quote for AC installation",
    "message": "Need a quote for pricing and install on a 3-ton unit.",
    "status": "received",
    "matched_sop_id": null,
    "matched_sop_title": null,
    "suggested_response": null,
    "created_at": "2026-05-24T08:12:00Z",
    "updated_at": "2026-05-24T08:12:00Z"
  },
  "processing": true
}
```

Poll `GET /enquiry/{id}/history` until `status` is `matched` or `escalated`.

**Example: no keyword match (auto-escalate)**

```json
{
  "customer_name": "Alex Kim",
  "channel": "email",
  "subject": "Hello",
  "message": "Just checking in — no specific topic."
}
```

After processing, `status` becomes `escalated` and timeline includes `auto_escalated`.

**Common errors**

```json
// 422 — empty customer_name
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "customer_name"],
      "msg": "String should have at least 1 character",
      "input": ""
    }
  ]
}
```

---

## Enquiry history

### `GET /enquiry/{enquiry_id}/history`

Current enquiry snapshot plus append-only events (oldest first in examples).

**Status codes**

| Code | Meaning |
|------|---------|
| `200` | History returned |
| `404` | Enquiry not found |

**Example response (`200`) — after SOP match**

```json
{
  "enquiry": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_name": "Priya Sharma",
    "channel": "whatsapp",
    "subject": "Pricing question",
    "message": "Please share pricing for the Growth plan.",
    "status": "matched",
    "matched_sop_id": "sop-pricing",
    "matched_sop_title": "Pricing & Plans",
    "suggested_response": "Thanks for your interest! Our Growth plan starts at…",
    "created_at": "2026-05-24T08:12:00Z",
    "updated_at": "2026-05-24T08:14:22Z"
  },
  "events": [
    {
      "id": 1,
      "event_type": "enquiry_created",
      "summary": "Enquiry received via WhatsApp",
      "detail": "Inbound message queued for SOP matching.",
      "created_at": "2026-05-24T08:12:00Z"
    },
    {
      "id": 2,
      "event_type": "task_started",
      "summary": "SOP matching started",
      "detail": null,
      "created_at": "2026-05-24T08:12:05Z"
    },
    {
      "id": 3,
      "event_type": "sop_matched",
      "summary": "Matched playbook: Pricing & Plans",
      "detail": "Keywords matched: pricing",
      "created_at": "2026-05-24T08:14:22Z"
    }
  ]
}
```

**Common errors**

```json
// 404
{
  "detail": "Enquiry not found"
}
```

---

## Follow-up

### `POST /enquiry/{enquiry_id}/follow-up`

Append customer message, clear SOP match fields, timeline event, re-queue matching.

**Request body**

```json
{
  "message": "Also need help with a refund on invoice 9921."
}
```

**Status codes**

| Code | Meaning |
|------|---------|
| `200` | Follow-up accepted; matching re-queued |
| `404` | Enquiry not found |
| `409` | Invalid state (e.g. closed or still processing) |
| `422` | Validation error |

**Example response (`200`)**

Returns the updated `EnquiryResponse` (same shape as `enquiry` in create/history). `message` includes the appended follow-up text; `status` may return to `received` while `processing` runs again.

**Common errors**

```json
// 409 — enquiry closed or processing
{
  "detail": "Cannot add follow-up while enquiry is processing"
}
```

---

## Manual escalate

### `POST /enquiry/{enquiry_id}/escalate`

Set status to escalated; append operator escalation event.

**Request body**

```json
{
  "reason": "Duplicate charge requires manager approval"
}
```

**Status codes**

| Code | Meaning |
|------|---------|
| `200` | Escalated |
| `404` | Enquiry not found |
| `409` | Already escalated or closed |
| `422` | Validation error |

**Example response (`200`)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customer_name": "Sarah Chen",
  "channel": "whatsapp",
  "subject": "Quote for AC installation",
  "message": "Need a quote for pricing and install on a 3-ton unit.",
  "status": "escalated",
  "matched_sop_id": "sop-pricing",
  "matched_sop_title": "Pricing & Plans",
  "suggested_response": null,
  "created_at": "2026-05-24T08:12:00Z",
  "updated_at": "2026-05-24T09:00:00Z"
}
```

**Common errors**

```json
// 409 — duplicate escalation
{
  "detail": "Enquiry is already escalated"
}
```

---

## Enquiry statuses

| Status | Meaning |
|--------|---------|
| `received` | Created; matching may be in progress |
| `processing` | Background SOP task running |
| `matched` | Playbook matched; suggested response available |
| `escalated` | Requires operator action |
| `closed` | Terminal (no public close endpoint yet) |

---

## Event types (timeline)

| `event_type` | When recorded |
|--------------|---------------|
| `enquiry_created` | `POST /enquiry` |
| `task_started` | Background matching begins |
| `sop_matched` | Keyword match found |
| `response_suggested` | Suggested reply generated |
| `auto_escalated` | No SOP match |
| `manual_escalated` | `POST /enquiry/{id}/escalate` |
| `follow_up` | `POST /enquiry/{id}/follow-up` |

Domain definitions and UI mapping: [product-contract.md](../product-contract.md).
