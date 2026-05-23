import time

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"


def test_create_enquiry_and_history(client: TestClient):
    create = client.post(
        "/enquiry",
        json={
            "customer_name": "Rahul Mehta",
            "channel": "email",
            "subject": "Pricing question",
            "message": "Can you share pricing for the Growth plan?",
        },
    )
    assert create.status_code == 202
    enquiry_id = create.json()["enquiry"]["id"]
    assert create.json()["processing"] is True

    time.sleep(0.3)

    history = client.get(f"/enquiry/{enquiry_id}/history")
    assert history.status_code == 200
    data = history.json()
    assert data["enquiry"]["status"] in ("matched", "processing", "escalated")
    assert len(data["events"]) >= 1


def test_no_sop_match_auto_escalates(client: TestClient):
    create = client.post(
        "/enquiry",
        json={
            "customer_name": "Unknown Lead",
            "channel": "web_chat",
            "subject": "Random",
            "message": "Just saying hello with no keywords.",
        },
    )
    enquiry_id = create.json()["enquiry"]["id"]
    time.sleep(0.3)

    history = client.get(f"/enquiry/{enquiry_id}/history")
    assert history.json()["enquiry"]["status"] == "escalated"
    event_types = [e["event_type"] for e in history.json()["events"]]
    assert "auto_escalated" in event_types


def test_follow_up(client: TestClient):
    create = client.post(
        "/enquiry",
        json={
            "customer_name": "Anita Rao",
            "channel": "whatsapp",
            "subject": "Invoice",
            "message": "I need a copy of last month's invoice.",
        },
    )
    enquiry_id = create.json()["enquiry"]["id"]

    follow = client.post(
        f"/enquiry/{enquiry_id}/follow-up",
        json={"message": "Also need a VAT breakdown."},
    )
    assert follow.status_code == 200
    assert "VAT" in follow.json()["message"]


def test_manual_escalate(client: TestClient):
    create = client.post(
        "/enquiry",
        json={
            "customer_name": "Legal Corp",
            "channel": "email",
            "subject": "Contract",
            "message": "Need enterprise terms.",
        },
    )
    enquiry_id = create.json()["enquiry"]["id"]

    escalated = client.post(
        f"/enquiry/{enquiry_id}/escalate",
        json={"reason": "Requires legal review"},
    )
    assert escalated.status_code == 200
    assert escalated.json()["status"] == "escalated"


def test_not_found(client: TestClient):
    missing = client.get("/enquiry/does-not-exist/history")
    assert missing.status_code == 404
