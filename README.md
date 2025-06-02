# About

This project is a **Project Management Tool** built using a full-stack architecture with Django REST Framework for the backend and React.js for the frontend. It supports **role-based access** for Admin and End Users to manage projects and tasks efficiently.

---
# 🚀 Tools Used:
## 🔧 Backend

**Main Stack**:
- **Django** – Web framework for rapid development.
- **Django REST Framework (DRF)** – To create RESTful APIs.
- **Simple JWT** – For secure token-based authentication.
- **PostgreSQL** – Database for storing users, projects, and tasks.
- 
---

## 🎨 Frontend

**Main Stack**:
- **React.js** – Frontend library using functional components and hooks.
- **Axios** – For making HTTP requests to the backend APIs.
- **TailwindCSS** or **Material UI** – For modern UI styling.
- **React Router** – For page navigation (Login, Dashboard, Project Details).

---

## 🛠️ Setup Instructions

Follow the steps below to set up and run the project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MuhammadIman-code/project-management-tool.git
cd project-management-tool
```

### 2️⃣ Backend Setup

Navigate to the backend directory and install the required Python packages:

```bash
cd backend
python -m venv venv
source venv\Scripts\activate  # Use `venv/bin/activate` on Mac
pip install -r requirements.txt
```

Run migrations and start the Django server:

```bash
python manage.py migrate
python manage.py runserver
```

### 3️⃣ Frontend Setup

Open a new terminal window/tab and navigate to the frontend folder:

```bash
cd frontend
npm install  # Installs all required node modules
npm run dev    # Runs the React development server
```

### 4️⃣ Access the Application (Optional)

You can access the Frontend by running this url:
```bash
http://localhost:5176
```

You can access the Backend by running this url:
```bash
http://localhost:8000/api/
```
