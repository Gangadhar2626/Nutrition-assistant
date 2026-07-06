# Nutrition Assistant

A full-stack MERN web application for nutrition tracking with role-based dashboards for **Admin**, **Dietitian**, and **User**.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control (Admin, Dietitian, User)
- Admin dashboard: user stats, approve dietitians, manage roles, delete users
- Dietitian dashboard: create/edit/delete meal plans, assign plans to clients
- User dashboard: view assigned meal plan, track daily progress, macro charts
- Chart.js visualizations: calories, protein, carbs, fat, and weight progress
- Responsive Bootstrap 5 UI with toast notifications

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React 19, Vite, React Router, Axios, Bootstrap 5, Chart.js |
| Backend  | Node.js, Express, MongoDB Atlas, Mongoose, JWT    |

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write permissions.
3. Add your IP address to the Network Access whitelist (or allow `0.0.0.0/0` for development).
4. Copy the connection string and replace `<username>`, `<password>`, and cluster details.

Example connection string:

```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/nutrition-assistant?retryWrites=true&w=majority
```

## Installation

### 1. Clone and enter the project

```bash
cd nutrition-assistant
```

### 2. Backend setup

```bash
cd server
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Sample `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nutrition-assistant?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@nutrition.com
ADMIN_PASSWORD=Admin@123456
```

Seed the default admin account (run once):

```bash
npm run seed:admin
```

Start the API server:

```bash
npm run dev
```

The API runs at **http://localhost:5000**.

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

Sample `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app runs at **http://localhost:5173**.

## Quick Start Workflow

1. **Seed admin** — `cd server && npm run seed:admin`
2. **Login as admin** — `admin@nutrition.com` / `Admin@123456`
3. **Register a dietitian** — use the Register page, select "Dietitian"
4. **Approve dietitian** — Admin Dashboard → Approve pending dietitian
5. **Register a user** — use the Register page, select "User"
6. **Login as dietitian** — create a meal plan and assign it to the user
7. **Login as user** — view the assigned plan and log daily progress

## API Endpoints

| Method | Route                        | Access    | Description              |
| ------ | ---------------------------- | --------- | ------------------------ |
| POST   | `/api/auth/register`         | Public    | Register user/dietitian  |
| POST   | `/api/auth/login`            | Public    | Login                    |
| GET    | `/api/users/profile`         | Auth      | Get profile              |
| PUT    | `/api/users/profile`         | Auth      | Update profile           |
| GET    | `/api/users/stats`           | Admin     | Dashboard stats          |
| GET    | `/api/users`                 | Admin     | List all users           |
| DELETE | `/api/users/:id`             | Admin     | Delete user              |
| PUT    | `/api/users/:id/approve`     | Admin     | Approve dietitian        |
| PUT    | `/api/users/:id/role`        | Admin     | Change user role         |
| GET    | `/api/users/clients`         | Dietitian | Assigned clients         |
| GET    | `/api/users/available-clients` | Dietitian | Users available to assign |
| GET    | `/api/mealplans`             | Auth      | Role-filtered meal plans |
| POST   | `/api/mealplans`             | Dietitian | Create meal plan         |
| PUT    | `/api/mealplans/:id`         | Dietitian | Update meal plan         |
| DELETE | `/api/mealplans/:id`         | Dietitian | Delete meal plan         |
| PUT    | `/api/mealplans/:id/assign`  | Dietitian | Assign plan to user      |
| GET    | `/api/progress`              | Auth      | Get progress entries     |
| POST   | `/api/progress`              | User      | Log daily progress       |
| PUT    | `/api/progress/:id`          | User      | Update progress          |
| DELETE | `/api/progress/:id`          | User      | Delete progress          |

## Project Structure

```
nutrition-assistant/
├── client/                 # React 19 + Vite frontend
│   └── src/
│       ├── components/     # Layout, charts, common UI
│       ├── context/        # Auth and Toast providers
│       ├── pages/          # Route pages and dashboards
│       ├── services/       # Axios API client
│       └── utils/          # Form validators
├── server/                 # Express API
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, roles, errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── utils/              # Token generation, admin seed
└── README.md
```

## Scripts

| Location | Command              | Description                |
| -------- | -------------------- | -------------------------- |
| server   | `npm run dev`        | Start API with nodemon     |
| server   | `npm start`          | Start API (production)     |
| server   | `npm run seed:admin` | Create default admin user  |
| client   | `npm run dev`        | Start Vite dev server      |
| client   | `npm run build`      | Production build           |

## License

MIT
