import time

from fastapi.testclient import TestClient


def _wait_for_processing(client: TestClient, enquiry_id: str, *, timeout: float = 2.0) -> dict:
    deadline = time.monotonic() + timeout
    last = None
    while time.monotonic() < deadline:
        response = client.get(f"/enquiry/{enquiry_id}/history")
        assert response.status_code == 200
        last = response.json()
        status = last["enquiry"]["status"]
        if status in ("matched", "escalated"):
            return last
        time.sleep(0.05)
    return last  # type: ignore[return-value]


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"


def test_create_enquiry_and_sop_match(client: TestClient):
    response = client.post(
        "/enquiry",
        json={
            "customer_name": "Priya Sharma",
            "channel": "whatsapp",
            "subject": "Pricing question",
            "message": "Please share pricing for the Growth plan.",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["processing"] is True
    enquiry_id = body["enquiry"]["id"]

    history = _wait_for_processing(client, enquiry_id)
    assert history["enquiry"]["status"] == "matched"
    assert history["enquiry"]["matched_sop_id"] == "sop-pricing"
    assert history["enquiry"]["suggested_response"]
    event_types = [e["event_type"] for e in history["events"]]
    assert "enquiry_created" in event_types
    assert "sop_matched" in event_types


def test_create_enquiry_auto_escalation(client: TestClient):
    response = client.post(
        "/enquiry",
        json={
            "customer_name": "Alex Kim",
            "channel": "email",
            "subject": "General hello",
            "message": "Just saying hi — no specific request yet.",
        },
    )
    assert response.status_code == 201
    enquiry_id = response.json()["enquiry"]["id"]

    history = _wait_for_processing(client, enquiry_id)
    assert history["enquiry"]["status"] == "escalated"
    assert history["enquiry"]["matched_sop_id"] is None
    assert "auto_escalated" in [e["event_type"] for e in history["events"]]


def test_follow_up_and_manual_escalate(client: TestClient):
    create = client.post(
        "/enquiry",
        json={
            "customer_name": "Rahul Mehta",
            "channel": "web_chat",
            "subject": "Pricing",
            "message": "Please share pricing for the Growth plan.",
        },
    )
    enquiry_id = create.json()["enquiry"]["id"]
    _wait_for_processing(client, enquiry_id)

    follow_up = client.post(
        f"/enquiry/{enquiry_id}/follow-up",
        json={"message": "Legal also needs SOC2 documentation."},
    )
    assert follow_up.status_code == 200
    assert "follow-up" in follow_up.json()["message"]

    history_after_follow_up = _wait_for_processing(client, enquiry_id)
    assert "follow_up" in [e["event_type"] for e in history_after_follow_up["events"]]

    escalate = client.post(
        f"/enquiry/{enquiry_id}/escalate",
        json={"reason": "Requires legal review"},
    )
    assert escalate.status_code == 200
    assert escalate.json()["status"] == "escalated"

    duplicate = client.post(
        f"/enquiry/{enquiry_id}/escalate",
        json={"reason": "Again"},
    )
    assert duplicate.status_code == 409
    assert "already escalated" in duplicate.json()["detail"].lower()


def test_not_found(client: TestClient):
    response = client.get("/enquiry/does-not-exist/history")
    assert response.status_code == 404


def test_validation_error(client: TestClient):
    response = client.post(
        "/enquiry",
        json={
            "customer_name": "",
            "channel": "whatsapp",
            "subject": "x",
            "message": "hello",
        },
    )
    assert response.status_code == 422
    assert "detail" in response.json()
