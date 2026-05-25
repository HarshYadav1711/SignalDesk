# SignalDesk Product Contract

Shared spec for **backend** and **frontend**. Update here first when behavior or naming changes, then align each track.

**Status:** API and mobile screens exist; the app still uses mocks (API integration pending).

---

## Purpose

Triage inbound enquiries for a small business: ingest messages, keyword-match SOP playbooks (no AI), keep an append-only ops timeline, show leads/escalations/follow-ups on a mobile dashboard.

---

## Core entities

| Entity | Owner | Description |
|--------|-------|-------------|
| **Enquiry** | Backend (source of truth) | One inbound customer thread: channel, subject, body, lifecycle status, optional SOP match fields. |
| **EnquiryEvent** | Backend | Append-only timeline entry for an enquiry (created, SOP matched, escalated, follow-up, etc.). |
| **SOP** | Backend (catalog) | Hardcoded playbook: id, title, keyword list, suggested response template. Not stored per enquiry until matched. |
| **Conversation** | Frontend (view model) | List/detail row for an enquiry. 1:1 with `Enquiry` once wired to the API. |
| **TimelineMessage** | Frontend (view model) | One line in conversation detail; from `EnquiryEvent` + message fields when integrated. |
| **DashboardMetric** | Frontend (view model) | Home KPI card; from enquiry aggregates (mocked until the API feeds it). |

### Enquiry (canonical fields)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string (UUID) | Stable identifier across API and UI. |
| `customer_name` | string | Display name. |
| `channel` | Channel | See channels below. |
| `subject` | string | Short subject line. |
| `message` | string | Latest or initial inbound body (API may append on follow-up). |
| `status` | EnquiryStatus | Backend lifecycle state. |
| `matched_sop_id` | string \| null | Set when keyword match succeeds. |
| `matched_sop_title` | string \| null | Human-readable SOP title. |
| `suggested_response` | string \| null | Template text from matched SOP. |
| `created_at` | datetime (ISO 8601, UTC) | |
| `updated_at` | datetime (ISO 8601, UTC) | |

### EnquiryEvent (canonical fields)

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Monotonic per database. |
| `enquiry_id` | string | FK to enquiry. |
| `event_type` | EventType | See event types below. |
| `summary` | string | Short line for timeline UI. |
| `detail` | string \| null | Optional longer text. |
| `created_at` | datetime (ISO 8601, UTC) | |

---

## Channels

Use these exact string values everywhere (API, database, mock JSON).

| Value | Label |
|-------|-------|
| `email` | Email |
| `whatsapp` | WhatsApp |
| `web_chat` | Web chat |
| `phone` | Phone |

---

## Enquiry statuses (backend)

| Value | Meaning |
|-------|---------|
| `received` | Accepted; not yet processed. |
| `processing` | Background SOP matching in progress. |
| `matched` | Keyword match found; suggested response available. |
| `escalated` | Requires human attention (auto or manual). |
| `closed` | Resolved or archived (future use). |

---

## Conversation statuses (frontend)

Used in lists, badges, and mock data until wired to the API.

| Value | Typical meaning |
|-------|-----------------|
| `new` | Unread / not yet triaged. |
| `matched` | SOP or playbook applied. |
| `escalated` | In escalation queue. |
| `awaiting_reply` | Waiting on customer. |
| `scheduled` | Callback or follow-up scheduled. |
| `closed` | Done. |

### Status mapping (frontend → backend)

When integrating, map UI status from backend `Enquiry.status` and event history:

| Frontend `ConversationStatus` | Backend `EnquiryStatus` / signals |
|------------------------------|-----------------------------------|
| `new` | `received` or `processing` |
| `matched` | `matched` |
| `escalated` | `escalated` |
| `awaiting_reply` | `matched` + recent `follow_up` event (heuristic) |
| `scheduled` | Derived from follow-up metadata (future field) |
| `closed` | `closed` |

---

## Event types (timeline)

| Value | When emitted |
|-------|----------------|
| `enquiry_created` | Enquiry accepted. |
| `task_started` | Background SOP job started. |
| `sop_matched` | Keyword match succeeded. |
| `auto_escalated` | No SOP match; escalated automatically. |
| `manual_escalated` | Operator called escalate. |
| `follow_up` | Customer sent additional message. |
| `response_suggested` | Suggested reply recorded (optional companion to `sop_matched`). |

---

## SOP categories

Five hardcoded playbooks. **Ids and titles are stable**; keyword lists and response text live in backend code.

| SOP id | Title | Topic keywords (non-exhaustive) |
|--------|-------|----------------------------------|
| `sop-pricing` | Pricing & Plans | price, pricing, cost, quote, plan |
| `sop-refund` | Refund & Cancellation | refund, cancel, cancellation, money back, chargeback |
| `sop-technical` | Technical Support | bug, error, broken, not working, crash, login, sync |
| `sop-billing` | Billing & Invoices | invoice, bill, billing, charge, payment, receipt |
| `sop-hours` | Business Hours & Availability | hours, open, schedule, when, availability, holiday |

Matching (backend): case-insensitive substring on enquiry `message` (and follow-up text when appended). First matching SOP wins unless we change that rule.

---

## API surface (backend)

Base path: `/` on backend service. OpenAPI: `/docs` when the API is running.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness and database connectivity. |
| `POST` | `/enquiry` | Create enquiry; queue background SOP matching. |
| `POST` | `/enquiry/{id}/follow-up` | Append customer follow-up message. |
| `POST` | `/enquiry/{id}/escalate` | Manual escalation with reason. |
| `GET` | `/enquiry/{id}/history` | Enquiry snapshot + `EnquiryEvent` list. |

Request/response shapes follow **Enquiry** and **EnquiryEvent** above. JSON field names use `snake_case` on the wire.

---

## Frontend surface (implemented — mock data)

| Screen / area | Route | Data source (current → future) |
|---------------|-------|--------------------------------|
| Home | Tab: `Home` | `mock/dashboard.json` + derived metrics → aggregates API |
| Leads | Tab: `Leads` | `mock/enquiries.json` (inbox filter) → enquiry list API |
| Escalations | Tab: `Escalations` | `mock/enquiries.json` (escalated filter) → filtered API |
| Follow-ups | Tab: `Follow-ups` | `mock/followUps.json` → scheduling API (future) |
| Conversation detail | Stack: `ConversationDetail` | `mock/enquiries.json` + `mock/events.json` → `GET /enquiry/{id}/history` |

Mock JSON under `frontend/mock/` mirrors API shapes using **camelCase** keys for TypeScript ergonomics.

---

## Naming conventions

| Layer | Convention | Example |
|-------|------------|---------|
| API / DB / Python | `snake_case` | `customer_name`, `matched_sop_id` |
| TypeScript / JSON mocks | `camelCase` | `customerName`, `matchedSopId` |
| SOP ids | kebab-case prefix `sop-` | `sop-pricing` |
| Enquiry ids | UUID string | `550e8400-e29b-41d4-a716-446655440000` |

---

## Who owns what

| Path | Track | Notes |
|------|-------|-------|
| `backend/` | Backend | — |
| `frontend/` | Frontend | — |
| `docs/product-contract.md` | Both | Agree here before types drift apart. |

The frontend can stay on mocks while the API evolves; types and field names still need to match this doc.

---

## Out of scope

Auth, payments, external CRMs, LLM/AI matching, multi-tenant workspaces.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-24 | Initial scaffold contract. |
| 2026-05-24 | Backend API implemented (FastAPI). |
| 2026-05-24 | Frontend screens implemented (Expo, mock data). |
