# Development workflow

How we change SignalDesk and how commits should read on `main`. Goal: small, reviewable diffs and messages that state **what** changed, not how “polished” it feels.

---

## Before you commit

1. **One concern per commit** — docs only, backend only, frontend only, or `frontend/mock/` only. Avoid mixing tracks unless a contract rename truly requires it (contract commit first, then implementations).
2. **Stage by path** — see [Staging map](#staging-map) below.
3. **Review the staged diff** — `git diff --staged` should match a single sentence you could use as the commit subject.
4. **Run checks for that track**:
   - Backend: `cd backend && pytest -q`
   - Frontend: `cd frontend && npm run typecheck`
5. **Write the message** — use [.gitmessage](../.gitmessage) or [CONTRIBUTING.md](../CONTRIBUTING.md). Optional checker: `scripts/check-commit-msg.ps1 -Message "your subject"`.

---

## Staging map

| If you changed… | Stage | Typical scope |
|-----------------|--------|----------------|
| `backend/` | `git add backend/` | `backend` |
| `frontend/src/`, `frontend/App.tsx`, screens, theme | `git add frontend/` (exclude `mock/` if mock-only) | `frontend` |
| `frontend/mock/` only | `git add frontend/mock/` | `mock` |
| `docs/`, root `README.md`, `CONTRIBUTING.md` | `git add docs/ README.md CONTRIBUTING.md` | `docs` |
| Screenshot PNGs + captions | `git add docs/screenshots/` | `docs` |
| `_render/` HTML/CSS for captures | `git add docs/screenshots/_render/` | `docs` |
| Repo hygiene (`.gitignore`, `.gitmessage`, `scripts/`) | paths as needed | `chore` (scope optional) |

**Split example** — UI tweak + mock copy + README:

```text
refactor(frontend): tighten escalation card hierarchy
refactor(mock): align enquiry subjects with HVAC demo scenario
docs: note mock-first integration in README engineering section
```

Three commits, three reviews.

---

## Commit message format

```
<type>(<scope>): <imperative summary>
```

| Type | Use when |
|------|----------|
| `feat` | New user- or API-visible behavior |
| `fix` | Bug fix; contract unchanged |
| `docs` | Documentation only |
| `refactor` | Structure or polish; same behavior |
| `test` | Tests only |
| `chore` | Tooling, ignore rules, templates |

| Scope | Paths |
|-------|--------|
| `backend` | `backend/` |
| `frontend` | `frontend/` except mocks |
| `mock` | `frontend/mock/` |
| `docs` | `docs/`, root README, CONTRIBUTING |

Omit scope for repo-wide `chore` (e.g. `chore: add MIT license`).

### Subject line rules

- Imperative, lowercase, **no trailing period**
- **≤ 72 characters** on the first line
- Name the **artifact or behavior** (`escalate endpoint`, `follow-up mock dates`, `API 409 body`)
- Optional body: **why**, when not obvious from the diff

### Avoid

| Weak | Better |
|------|--------|
| `final update` | `docs: add walkthrough checklist to docs/walkthrough` |
| `fixed stuff` | `fix(backend): return 409 when follow-up during processing` |
| `latest` | `refactor(frontend): extract ChannelBadge from LeadCard` |
| `misc` / `WIP` | Split or use a feature branch |
| `improve authenticity` / `strengthen narrative` | State the concrete change |
| `complete submission` / `finalize deliverables` | Describe the doc or asset added |

Marketing or grading language in subjects makes history harder to scan and does not help reviewers.

---

## Suggested order for multi-area work

When a feature touches contract + API + UI:

1. `docs: …` — update [product-contract.md](product-contract.md) if fields or statuses change
2. `feat(backend): …` or `fix(backend): …`
3. `feat(frontend): …` / `refactor(frontend): …`
4. `refactor(mock): …` if demo data must follow
5. `docs: …` — API examples, screenshots, README only if needed

---

## Branches and `main`

- Prefer a short-lived branch for non-trivial work: `feat/backend-close-enquiry`, `docs/api-follow-up-409`.
- Keep `main` mergeable: focused commits, passing checks for the touched track.
- Do **not** force-push `main` to rewrite messages on shared history.

---

## History on this repo

Early commits (`Foundational structure`, `Fixes`) are left as-is on the public branch. From `03db44b` onward, history is intentionally split by track (`feat(backend)`, `feat(frontend)`, `docs:`, `refactor(mock)`, etc.). Continue that pattern; do not rebase `main` for cosmetic message edits alone.

Recent discipline additions: [.gitmessage](../.gitmessage), [CONTRIBUTING.md](../CONTRIBUTING.md), commit checker under `scripts/`.

---

## Optional: commit-msg hook (local)

To block badly formatted subjects before they land:

```powershell
# From repo root (local config only — do not commit .git/config)
git config core.hooksPath .githooks
```

Create `.githooks/commit-msg` (not required in repo; copy locally if you want):

```sh
#!/bin/sh
powershell.exe -NoProfile -File scripts/check-commit-msg.ps1 -MessageFile "$1"
exit $?
```

Or run manually before commit:

```powershell
.\scripts\check-commit-msg.ps1 -Message "docs: add development workflow guide"
```

---

## Pull requests

Use [.github/pull_request_template.md](../.github/pull_request_template.md). List commits or areas touched; note backend/frontend test commands run.
