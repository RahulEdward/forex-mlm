# Multi-Level Referral System Architecture

## 1. System Overview

This document outlines the architecture for a production-ready, 20-level referral system integrated into a broker-based trading platform. The system emphasizes strict data isolation, role-based access control, and performance scalability.

### Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Frontend**: Next.js (App Router)
- **Auth**: JWT (Stateless)

## 2. Database Design (PostgreSQL)

### A. Extended User Model (`users`)
We extend the existing user table to support the referral hierarchy.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | Integer | PK | |
| `referral_code` | String(12) | Unique, Index | Randomly generated, immutable unique ID for referrals. |
| `referred_by_id` | Integer | FK(`users.id`), Index | The immediate upline (parent). Null for root users. |
| `broker_connected` | Boolean | Default `False` | Fast lookup for broker status. |

### B. Broker Account Model (`broker_accounts`)
Ensures isolation of broker credentials.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | Integer | PK | |
| `user_id` | Integer | One-to-One, FK, Unique | Links to a single user. |
| `broker_name` | String | | e.g., "AngelOne", "Zerodha". |
| `client_id` | String | | Broker-specific client ID. |
| `encrypted_api_key` | String | | AES-256 encrypted credentials. |

### C. Referral Statistics Model (`referral_stats`)
To optimize performance, we pre-calculate or cache stats instead of running deep recursive queries on every dashboard load.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | Integer | PK, FK | |
| `direct_referrals` | Integer | Default 0 | Count of Level 1 referrals. |
| `total_team_size` | Integer | Default 0 | Count of complete downline (Levels 1-20). |
| `level_breakdown` | JSONB | | e.g., `{"1": 5, "2": 20, ...}` |

## 3. Data Isolation & Security Strategy

### A. Role-Based Access Control (RBAC)
- **Users**: Can ONLY access their own `user_id` and the sub-tree rooted at their `user_id`.
- **Super Admin**: Can access any record.

### B. Implementation (FastAPI Dependencies)
We will use a strict dependency injection pattern to enforce isolation.

```python
def get_current_user_scope(current_user: User):
    # Returns a query filter
    if current_user.role == "super_admin":
        return text("") # No filter
    return User.referred_by_id == current_user.id # Example for direct
```

### C. Broker Isolation
Broker data is accessed *only* via `current_user.broker_account`. No ID-based lookup endpoints (e.g., `/api/broker/{id}`) will be exposed to standard users.

## 4. API Structure

### Auth & Registration
- `POST /api/auth/register`:
  - Accepts `referral_code` (optional).
  - Validates code existence.
  - Prevents self-referral.
  - Generates new `referral_code` for the registrant.
  - Locks `referred_by_id`.

### Referral Management
- `GET /api/referrals/stats`:
  - Returns `direct_referrals`, `total_team_size`.
  - Uses `referral_stats` table for O(1) fetch.
- `GET /api/referrals/tree`:
  - params: `depth` (max 20).
  - Uses PostgreSQL Recursive CTE to fetch hierarchy efficiently.
  - **Security**: If `user` role, forces root of tree to be `current_user`.

### Super Admin
- `GET /api/admin/referrals/global-tree`:
  - Full visibility.
- `GET /api/admin/stats`:
  - System-wide metrics.

## 5. Performance Optimization (The 20-Level Challenge)

Querying 20 levels deep for every page load is expensive.
**Solution**:
1.  **Recursive CTEs**: Use `WITH RECURSIVE` in SQLAlchemy for "live" tree generic views.
2.  **Materialized View / Cached Stats**: The `referral_stats` table will be updated asynchronously (Postgres Triggers or Background Tasks) whenever a new user registers.
    - When User C registers under User B (who is under User A):
    - Increment `direct_referrals` for B.
    - Increment `total_team_size` for B and A (up to 20 levels).

## 6. Project Structure

```
backend/
  ├── app/
  │   ├── routers/
  │   │   ├── auth.py         # Modified registration
  │   │   ├── referrals.py    # New referral endpoints
  │   │   └── admin.py        # Admin views
  │   ├── services/
  │   │   └── referral.py     # Logic for tree traversal & stats
  │   ├── core/
  │   │   └── security.py     # Auth utilities
  │   ├── models.py           # DB Models
  │   ├── schemas.py          # Pydantic Models
  │   └── main.py             # App entry
```
