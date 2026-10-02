from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional
from uuid import uuid4

SERVICE_FEE_RATE = 0.05
DELIVERY_FEE = 3500

ALLOWED_ORDER_TRANSITIONS = {
    "processing": ["fulfilled", "cancelled"],
    "fulfilled": ["completed"],
    "completed": [],
    "cancelled": [],
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_email(email: str) -> str:
    return email.strip().lower()


def format_currency(amount: int) -> str:
    return f"NGN {amount:,.0f}"


def validate_registration(
    payload: Dict[str, Any], existing_emails: Iterable[str]
) -> List[str]:
    errors: List[str] = []
    name = str(payload.get("name", "")).strip()
    email = normalize_email(str(payload.get("email", "")))
    password = str(payload.get("password", ""))
    confirm_password = str(payload.get("confirm_password", ""))
    account_type = str(payload.get("account_type", "")).strip()
    organization = str(payload.get("organization", "")).strip()

    if not name:
        errors.append("Full name is required.")
    if not email or "@" not in email or "." not in email.split("@")[-1]:
        errors.append("Enter a valid email address.")
    if email and email in {normalize_email(item) for item in existing_emails}:
        errors.append("An account already exists with this email.")
    if len(password) < 8:
        errors.append("Password must be at least 8 characters.")
    if password != confirm_password:
        errors.append("Passwords do not match.")
    if account_type not in {"student", "expert", "institution"}:
        errors.append("Choose a valid account type.")
    if not organization:
        errors.append("University or organization is required.")
    return errors


def calculate_totals(cart_items: Iterable[Dict[str, Any]]) -> Dict[str, int]:
    subtotal = 0
    for item in cart_items:
        price = int(item.get("price", 0))
        quantity = max(int(item.get("quantity", 1)), 0)
        subtotal += price * quantity

    service_fee = int(round(subtotal * SERVICE_FEE_RATE)) if subtotal else 0
    delivery_fee = DELIVERY_FEE if subtotal else 0
    total = subtotal + service_fee + delivery_fee
    return {
        "subtotal": subtotal,
        "service_fee": service_fee,
        "delivery_fee": delivery_fee,
        "total": total,
    }


def can_publish_listing(user: Optional[Dict[str, Any]]) -> bool:
    if not user:
        return False
    return bool(user.get("is_verified")) and user.get("user_type") in {
        "student",
        "expert",
        "institution",
    }


def can_manage_listing(user: Optional[Dict[str, Any]], listing: Dict[str, Any]) -> bool:
    if not user:
        return False
    return (
        can_publish_listing(user)
        and normalize_email(str(user.get("email", "")))
        == normalize_email(str(listing.get("owner_email", "")))
    )


def get_allowed_transitions(status: str) -> List[str]:
    return ALLOWED_ORDER_TRANSITIONS.get(status, [])


def checkout_cart(
    user: Dict[str, Any],
    cart_items: List[Dict[str, Any]],
    delivery_details: Dict[str, Any],
    payment_method: str,
    created_at: Optional[str] = None,
) -> Dict[str, Any]:
    if not cart_items:
        raise ValueError("Your cart is empty.")

    summary = calculate_totals(cart_items)
    if summary["total"] <= 0:
        raise ValueError("Cart total must be greater than zero.")

    if payment_method not in {"demo", "wallet"}:
        raise ValueError("Choose a supported payment method.")

    updated_user = deepcopy(user)
    wallet_balance = int(updated_user.get("wallet_balance", 0))

    if payment_method == "wallet" and wallet_balance < summary["total"]:
        raise ValueError("Insufficient demo wallet balance.")

    if payment_method == "wallet":
        updated_user["wallet_balance"] = wallet_balance - summary["total"]

    created = created_at or now_iso()
    order = {
        "id": f"ord-{uuid4().hex[:10]}",
        "created_at": created,
        "status": "processing",
        "payment_status": "paid_wallet" if payment_method == "wallet" else "paid_demo",
        "payment_method": payment_method,
        "payment_reference": f"demo-{uuid4().hex[:8]}",
        "delivery_details": {
            "full_name": str(delivery_details.get("full_name", "")).strip(),
            "phone": str(delivery_details.get("phone", "")).strip(),
            "address": str(delivery_details.get("address", "")).strip(),
            "city": str(delivery_details.get("city", "")).strip(),
            "notes": str(delivery_details.get("notes", "")).strip(),
        },
        "items": [
            {
                "id": item.get("id"),
                "title": item.get("title"),
                "category": item.get("category"),
                "price": int(item.get("price", 0)),
                "quantity": max(int(item.get("quantity", 1)), 1),
                "seller": item.get("seller"),
            }
            for item in cart_items
        ],
        "summary": summary,
        "history": [
            {
                "status": "processing",
                "timestamp": created,
                "note": "Order created in the CampusLink demo checkout.",
            }
        ],
    }
    return {"order": order, "updated_user": updated_user}


def transition_order_status(
    order: Dict[str, Any],
    new_status: str,
    timestamp: Optional[str] = None,
) -> Dict[str, Any]:
    current_status = str(order.get("status", "processing"))
    allowed = get_allowed_transitions(current_status)
    if new_status not in allowed:
        raise ValueError(
            f"Cannot move order from {current_status} to {new_status} in the demo flow."
        )

    updated = deepcopy(order)
    updated["status"] = new_status
    updated.setdefault("history", []).append(
        {
            "status": new_status,
            "timestamp": timestamp or now_iso(),
            "note": f"Status moved to {new_status}.",
        }
    )
    return updated
