# Forex MLM Trading Platform

![Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=300&section=header&text=Forex%20MLM&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Advanced%20Broker%20Integrated%20System&descAlignY=51&descAlign=62)

## 🚀 System Overview
A production-ready **Multi-Level Marketing (MLM) Trading System** integrated with broker APIs.

### 🌟 Key Features
- **20-Level Referral System**: Deep hierarchy tracking with recursive visualization.
- **Broker Integration**: Secure, isolated broker account connections.
- **Role-Based Access**: Strict separation between User and Super Admin.
- **Real-Time Dashboards**: Live statistics and downline tracking.

### 🛠️ Tech Stack
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL/SQLite
- **Frontend**: Next.js 14, TailwindCSS, Lucide Icons
- **Auth**: JWT Stateless Authentication

## 📦 Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Default Credentials
- **Super Admin**: `superadmin@example.com` / `superadmin123`
- **Test User**: `user@example.com` / `user123`
