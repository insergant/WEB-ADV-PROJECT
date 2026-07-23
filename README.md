# ScoutConnect - Full-Stack Scouting Community & Management Portal

ScoutConnect is a full-stack web application built to streamline scouting troop operations, manage member registrations, showcase programs dynamically, and track outdoor events and activities.

---

## 🛠️ Technology Stack

* **Frontend:** React.js, Tailwind CSS, React Router, React Icons
* **Backend:** Node.js, Express.js, CORS
* **Database:** MySQL (managed locally via XAMPP phpMyAdmin)

---

## 📂 Project Structure

```text
WEB-ADV-PROJECT/
│
├── scout-frontend/            # React Client Application
│   ├── src/
│   │   ├── components/        # Navbar.js, Footer.js
│   │   ├── pages/             # Home.js, About.js, Services.js, Contact.js, Register.js, Login.js
│   │   ├── App.js             # Master Router Layout
│   │   └── index.css          # Tailwind CSS directives
│   └── package.json
│
└── scout-backend/             # Node.js / Express Server API
    ├── server.js              # Main API entry point & routes
    ├── db.js                  # XAMPP MySQL database connection pool
    └── package.json
