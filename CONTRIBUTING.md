# Contributing

SignalDesk is a small monorepo (`backend/`, `frontend/`, `docs/`). Keep commits **small**, **scoped to one concern**, and **easy to review in isolation**.

## Commit message format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short imperative summary>

[optional body — what changed and why, wrapped at ~72 chars]
```

| Part | Rules |
|------|--------|
| **type** | `feat`, `fix`, `docs`, `refactor`, `test`, `chore` |
| **scope** | Optional but recommended: `backend`, `frontend`, `docs` |
| **summary** | Imperative, lowercase, no period; ≤ ~72 characters |
| **body** | Use when the “why” is not obvious from the diff |

### Types

| Type | When to use |
|------|-------------|
| `feat` | New behavior users or API clients can observe |
| `fix` | Bug fix without changing intended contracts |
| `docs` | README, contract, API examples, screenshots, comments only |
| `refactor` | Internal structure or polish; same external behavior |
| `test` | Tests only |
| `chore` | Tooling, deps, `.gitignore`, repo hygiene — no product logic |

### Scopes (this repo)

| Scope | Paths (typical) |
|-------|------------------|
| `backend` | `backend/` |
| `frontend` | `frontend/` |
| `docs` | `docs/`, root `README.md`, `CONTRIBUTING.md` |

Omit scope only for repo-wide chores (e.g. `chore: add MIT license`).

## Split changes across commits

Prefer **multiple focused commits** over one mixed commit:

| Change | Example commit |
|--------|----------------|
| API behavior or service logic | `feat(backend): add close endpoint for enquiries` |
| Backend polish (logs, errors, OpenAPI) | `refactor(backend): standardize structured logging on routes` |
| UI or navigation | `feat(frontend): show escalation reason on conversation header` |
| UI polish only | `refactor(frontend): align status badge colors with theme tokens` |
| Product contract or API docs | `docs: document closed status transition` |
| README / screenshots / walkthrough | `docs: add conversation detail screenshot and caption` |
| Dependencies or lint config | `chore(frontend): bump expo SDK patch version` |

**Do not** combine `backend/` and `frontend/` in one commit unless the change is a single unavoidable contract rename documented in `docs/product-contract.md` — and even then, prefer `docs:` for the contract plus separate implementation commits.

## Good vs weak summaries

| Avoid | Prefer |
|-------|--------|
| `fix stuff` | `fix(backend): return 409 when follow-up sent during processing` |
| `final changes` | `docs: tighten README quick start for Windows` |
| `update` | `refactor(frontend): extract ChannelBadge component` |
| `Fixes` | `fix(backend): close background task DB session on failure` |
| `WIP` | *(don't commit WIP on `main`; use a branch)* |
| `misc` | Split into `docs:`, `chore:`, or scoped `refactor:` commits |

Submission or assignment language in messages (`finalize submission`, `complete deliverables`) reads less well in a professional history — describe **what** changed: `docs: add walkthrough recording guide`.

## Suggested workflow

1. Stage by area: `git add backend/` · `git add frontend/` · `git add docs/ README.md`
2. `git diff --staged` — one logical change?
3. `git commit` with the format above
4. Repeat until the working tree is clean

Optional commit template (local only):

```bash
git config commit.template .gitmessage
```

## History on `main`

Early commits include vague messages (`Foundational structure`, `Fixes`). **Do not rewrite pushed history** for cosmetics alone — continue with clear messages from here forward.
