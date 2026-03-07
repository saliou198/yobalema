# Yobalema Fullstack Setup

## 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## 2) Frontend

```bash
cd yobalema
cp .env.example .env
npm install
npm run dev
```

## API base URL
- Backend default: `http://localhost:5000`
- Frontend default API: `http://localhost:5000/api`

## Notes
- Database is PostgreSQL through Sequelize.
- `sequelize.sync()` runs on server startup.
- Socket.io uses user-room join with event `auth:join`.
