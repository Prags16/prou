# ProU – Full Stack Assignment  
React Frontend • Node.js Backend • PostgreSQL • Deployment (Netlify + Render)

This is a full-stack Employees & Tasks management app built for the ProU assessment.  
It includes employee management, task assignment, and a dashboard with summarized analytics.


🚀 Live Demo Links

🔹 Frontend (Netlify)
https://prou-assignment.netlify.app/

🔹 Backend API (Render)
https://prou-backend-4qhg.onrender.com


🛠️ Tech Stack
Frontend
- React (Vite)
- React Hooks & State Management
- Fetch API
- Clean responsive UI

Backend
- Node.js
- Express.js
- PostgreSQL with `pg`

Database
- Render Managed PostgreSQL  
- Tables:
  - `employees(id, name, role, email)`
  - `tasks(id, title, description, status, assignedTo)`

Deployment
- Netlify (Frontend)  
- Render (Backend)  
- Render Managed PostgreSQL (Database)

Features

Employees
- Add employee  
- Edit employee  
- Delete employee  
- View employees list  

Tasks
- Add task  
- Assign to employee  
- Edit/delete task  
- Joined API response includes `assigned_name`

Dashboard
- Chart for total employees & tasks  

 Project Structure
/client  → React frontend  
/api     → Node Express backend  

 Running Locally

1. Clone Repo
```bash
git clone https://github.com/Prags16/prou.git
cd prou
```

2. Start Backend
```bash
cd api
npm install
node server.js
```

3. Start Frontend
```bash
cd client
npm install
npm run dev
```

4. Environment Variable
In backend:
```
DATABASE_URL="postgres://user:pass@host:5432/db"
```
API Endpoints

```
GET /employees  
POST /employees  
PUT /employees/:id  
DELETE /employees/:id  

GET /tasks  
POST /tasks  
PUT /tasks/:id  
DELETE /tasks/:id  
```
  
Screenshots
All screenshots required for evaluation are included in the `/screenshots` folder of this repository:
- Frontend UI (Employees, Tasks, Dashboard)
- Backend API responses
- PostgreSQL tables (pgAdmin)
- Netlify deployment confirmation
- Render backend live status


Author  
Pragnya Neerukonda
ProU Mini Fullstack Assignment  
