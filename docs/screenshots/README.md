# UI screenshots

PNG captures of the Expo dashboard. Same Northline HVAC demo data as `frontend/mock/`.

| Screen | Image | Caption |
|--------|-------|---------|
| Home dashboard | [home.png](home.png) | [home.md](home.md) |
| Leads inbox | [leads.png](leads.png) | [leads.md](leads.md) |
| Escalations | [escalations.png](escalations.png) | [escalations.md](escalations.md) |
| Follow-ups | [follow-ups.png](follow-ups.png) | [follow-ups.md](follow-ups.md) |
| Conversation detail | [conversation-detail.png](conversation-detail.png) | [conversation-detail.md](conversation-detail.md) |

Root overview: [../../README.md](../../README.md#screenshots)

---

## Gallery

### Home dashboard

![Home dashboard](home.png)

KPI row, priority queue, and recent activity. See [home.md](home.md).

### Leads inbox

![Leads inbox](leads.png)

Inbound enquiries with channel and status badges. See [leads.md](leads.md).

### Escalations

![Escalations](escalations.png)

Escalation reasons and priority indicators. See [escalations.md](escalations.md).

### Follow-ups

![Follow-ups](follow-ups.png)

Sections: overdue, due today, upcoming. See [follow-ups.md](follow-ups.md).

### Conversation detail

![Conversation detail](conversation-detail.png)

Message, suggested SOP response, and timeline. See [conversation-detail.md](conversation-detail.md).

---

## Regenerating captures

HTML mocks live in [`_render/`](_render/). To refresh PNGs after UI token changes:

```bash
cd docs/screenshots/_render
npx --yes -p playwright@1.49.1 playwright install chromium
npx --yes -p playwright@1.49.1 node capture.mjs
```

Optional short clips (e.g. `leads.mp4`) can live alongside PNGs. The primary end-to-end demo belongs in [`../walkthrough/`](../walkthrough/README.md).
