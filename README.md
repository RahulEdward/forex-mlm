# Forex MLM Trading Platform

![Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=300&section=header&text=Forex%20MLM&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Advanced%20Broker%20Integrated%20System&descAlignY=51&descAlign=62)

## 🚀 System Overview
A production-ready **Multi-Level Marketing (MLM) Trading System** integrated with broker APIs, featuring a modern "Cosmic" design and robust administrative controls.

### 🌟 Key Features
- **Cosmic UI Redesign**: Stunning, modern interface with glassmorphism effects, dark mode, and smooth animations found on Landing, Login, and Register pages.
- **Advanced Network Visualization**: Interactive **Hierarchy Viewer** with dual modes (Org Chart & List View) to explore deep referral structures up to 20 levels.
- **Dynamic Commission Engine**: Fully configurable **Distribution Settings** for managing direct bonuses, level-wise payouts, and global pool allocations.
- **20-Level Referral System**: Deep hierarchy tracking with real-time team size calculations.
- **Broker Integration**: Secure, isolated broker account connections.
- **Role-Based Access**: strict separation between User (My Network, Earnings) and Super Admin (Global Network, Distributions, User Management).

### 🛠️ Tech Stack
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL/SQLite
- **Frontend**: Next.js 14, TailwindCSS, Lucide Icons, Framer Motion
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
