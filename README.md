# 🏃 Run for Glory - Marathon Registration Portal

> **Simple, Modern Web Technology Project**  
> Built with: **HTML, CSS, JavaScript, React.js (Vite), and Node.js + Express.js**  
> Clean **Light Theme** (White background, light blue sections, orange buttons).

---

## 📁 1. Project Folder Structure

The project is kept as short and simple as possible with the minimum number of files:

```text
web-project/
├── backend/
│   ├── package.json       # Express server dependencies
│   └── server.js          # Node.js + Express server (in-memory array storage)
├── frontend/
│   ├── index.html         # HTML page structure & fonts
│   ├── package.json       # React & Vite dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── public/
│   │   └── marathon.jpg   # Small running image for home page
│   └── src/
│       ├── main.jsx       # Mounts React into HTML
│       ├── App.jsx        # ONLY React component (Navbar, Home, About, Form, Table)
│       └── App.css        # Clean light theme CSS styling
└── README.md              # Project documentation & review guide
```

---

## 🚀 2. Steps to Run the Project in VS Code

You only need **two terminals** in VS Code.

### Terminal 1: Run the Backend Server
```powershell
# 1. Go to backend folder
cd backend

# 2. Install dependencies (only needed once)
npm install

# 3. Start server
npm start
```
*Output: `Server is running at http://localhost:5000`*

---

### Terminal 2: Run the Frontend
Click the `+` icon in VS Code terminal panel to open a second tab:
```powershell
# 1. Go to frontend folder
cd frontend

# 2. Install dependencies (only needed once)
npm install

# 3. Start React dev server
npm run dev
```
*Output: `Local: http://localhost:5173/`*

Open **`http://localhost:5173`** in your browser.

---

## 💻 3. Complete Source Code for Every File

### File 1: `backend/package.json`
```json
{
  "name": "marathon-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2"
  }
}
```

### File 2: `backend/server.js`
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-memory array to store registrations temporarily
let registrations = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', category: '10K' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '9812345678', category: '5K' }
];

// GET: Send list of registered participants to frontend
app.get('/api/registrations', (req, res) => {
  res.json(registrations);
});

// POST: Add a new participant to the list
app.post('/api/registrations', (req, res) => {
  const { name, email, phone, category } = req.body;

  // Simple validation
  if (!name || !email || !phone || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newParticipant = {
    id: registrations.length + 1,
    name,
    email,
    phone,
    category
  };

  registrations.push(newParticipant);

  res.status(201).json({
    message: `Thank you ${name}! You are successfully registered for the ${category} race.`,
    participant: newParticipant
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

---

### File 3: `frontend/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Run for Glory - Marathon Registration Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### File 4: `frontend/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### File 5: `frontend/src/App.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  // 1. State variables
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '10K'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Fetch participants from backend API on page load
  const fetchParticipants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/registrations');
      const data = await response.json();
      setParticipants(data);
    } catch (err) {
      console.log('Error fetching participants:', err);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // 3. Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error when user types
  };

  // 4. Form submission and JavaScript validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.phone.length !== 10 || isNaN(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    // Send data to Express backend using fetch() POST
    try {
      const response = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        // Reset form inputs
        setFormData({ name: '', email: '', phone: '', category: '10K' });
        // Refresh participants table
        fetchParticipants();
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Unable to reach the server. Make sure the backend is running.');
    }
  };

  // 5. Smooth scroll helper
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* 1. Simple Navbar */}
      <nav className="navbar">
        <div className="nav-brand">RUN FOR GLORY</div>
        <div className="nav-links">
          <button onClick={() => scrollTo('home')} className="nav-btn">Home</button>
          <button onClick={() => scrollTo('about')} className="nav-btn">About</button>
          <button onClick={() => scrollTo('register')} className="nav-btn btn-nav-register">Register</button>
        </div>
      </nav>

      {/* 2. Home Section */}
      <section id="home" className="home-section">
        <div className="home-content">
          <div className="home-text">
            <h1>Run for Glory</h1>
            <p className="tagline">
              Join the city's premier running celebration. Push your limits, achieve fitness, and experience the thrill of the race!
            </p>
            <button onClick={() => scrollTo('register')} className="btn-orange">
              Register Now
            </button>
          </div>
          <div className="home-image-box">
            <img src="/marathon.jpg" alt="Marathon runners" className="marathon-img" />
          </div>
        </div>
      </section>

      {/* 3. Event Details Section (About) */}
      <section id="about" className="details-section">
        <div className="section-title">
          <h2>Marathon Event Details</h2>
          <p>Key information about the upcoming race</p>
        </div>

        <div className="details-grid">
          <div className="detail-card">
            <h3>📅 Date & Time</h3>
            <p>Sunday, November 15, 2026</p>
            <span className="card-sub">Flag off at 6:00 AM</span>
          </div>

          <div className="detail-card">
            <h3>📍 Location</h3>
            <p>City Central Stadium Plaza</p>
            <span className="card-sub">Main Ground Entrance</span>
          </div>

          <div className="detail-card">
            <h3>🏁 Race Distances</h3>
            <p><strong>5K</strong> • <strong>10K</strong> • <strong>21K</strong></p>
            <span className="card-sub">Medals for all finishers</span>
          </div>
        </div>
      </section>

      {/* 4. Registration Form Section */}
      <section id="register" className="register-section">
        <div className="form-box">
          <h2>Participant Registration</h2>
          <p className="form-subtitle">Fill in your details to secure your spot</p>

          {/* Error Message */}
          {error && <div className="error-alert">{error}</div>}

          {/* 5. Success Message */}
          {successMessage && <div className="success-alert">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="reg-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number (10 digits)</label>
              <input
                type="tel"
                name="phone"
                maxLength="10"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Race Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="5K">5K Fun Run</option>
                <option value="10K">10K Challenge</option>
                <option value="21K">21K Half Marathon</option>
              </select>
            </div>

            <button type="submit" className="btn-orange btn-full">
              Register
            </button>
          </form>
        </div>
      </section>

      {/* 6. Registered Participants Table */}
      <section className="table-section">
        <div className="section-title">
          <h2>Registered Participants</h2>
          <p>Total Registered: {participants.length}</p>
        </div>

        <div className="table-card">
          {participants.length === 0 ? (
            <p className="no-data">No participants registered yet.</p>
          ) : (
            <table className="participants-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, index) => (
                  <tr key={p.id || index}>
                    <td>{index + 1}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td><span className="badge">{p.category}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="footer">
        <p>© 2026 Run for Glory Marathon Portal | Web Technology Project</p>
      </footer>
    </div>
  );
}
```

---

### File 6: `frontend/src/App.css`
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  color: #1e293b;
  line-height: 1.6;
  min-height: 100vh;
  /* Whole-page marathon running background with light overlay for readability */
  background: 
    linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)),
    url('https://img.magnific.com/premium-vector/flat-vector-marathon-running-sport-background-fitness-enthusiasts_1324823-18495.jpg?semt=ais_hybrid&w=740&q=80') center/cover no-repeat fixed,
    url('/page-bg.jpg') center/cover no-repeat fixed;
}

.app-container {
  width: 100%;
}

/* 1. Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-size: 1.35rem;
  font-weight: 700;
  color: #ff6b35;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-btn:hover {
  color: #ff6b35;
}

.btn-nav-register {
  background-color: #ff6b35;
  color: #ffffff !important;
  font-weight: 600;
}

.btn-nav-register:hover {
  background-color: #e85923;
}

/* Orange Buttons */
.btn-orange {
  background-color: #ff6b35;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-orange:hover {
  background-color: #e85923;
  transform: translateY(-1px);
}

.btn-full {
  width: 100%;
  margin-top: 0.5rem;
}

/* 2. Home Section */
.home-section {
  position: relative;
  padding: 4.5rem 5%;
  background-color: #ffffff;
  overflow: hidden;
}

/* Faded marathon background image (subtle opacity keeps text 100% readable) */
.home-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/marathon.jpg') center/cover no-repeat;
  opacity: 0.12;
  pointer-events: none;
}

.home-content {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.home-text {
  flex: 1;
}

.home-text h1 {
  font-size: 2.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.tagline {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.home-image-box {
  flex: 1;
  display: flex;
  justify-content: center;
}

.marathon-img {
  width: 100%;
  max-width: 440px;
  height: 280px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* 3. Event Details Section (Light Blue) */
.details-section {
  padding: 4rem 5%;
  background-color: #eef6fc;
}

.section-title {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.section-title p {
  color: #64748b;
  font-size: 0.95rem;
}

.details-grid {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.detail-card {
  background-color: #ffffff;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
}

.detail-card h3 {
  font-size: 1.15rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.detail-card p {
  font-size: 1.05rem;
  color: #334155;
  margin-bottom: 0.35rem;
}

.card-sub {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* 4. Registration Form Section */
.register-section {
  padding: 4.5rem 5%;
  background-color: #ffffff;
}

.form-box {
  max-width: 520px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.form-box h2 {
  font-size: 1.75rem;
  text-align: center;
  color: #0f172a;
  margin-bottom: 0.3rem;
}

.form-subtitle {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.75rem;
}

.reg-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: #ffffff;
  color: #1e293b;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #ff6b35;
}

/* Alerts */
.error-alert {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  text-align: center;
}

.success-alert {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
}

/* 5. Registered Participants Table (Light Blue) */
.table-section {
  padding: 4rem 5%;
  background-color: #eef6fc;
}

.table-card {
  max-width: 900px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.participants-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.participants-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.participants-table td {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.92rem;
  color: #334155;
}

.participants-table tr:hover {
  background-color: #f8fafc;
}

.badge {
  background-color: #fff7ed;
  color: #ff6b35;
  font-weight: 600;
  font-size: 0.82rem;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #fed7aa;
}

.no-data {
  text-align: center;
  padding: 2.5rem;
  color: #94a3b8;
}

/* Footer */
.footer {
  text-align: center;
  padding: 1.5rem 5%;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.85rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .home-content {
    flex-direction: column;
    text-align: center;
  }

  .home-text h1 {
    font-size: 2.2rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .form-box {
    padding: 2rem 1.25rem;
  }
}
```

---

## 📖 4. Simple English Explanation of Each File

1. **`backend/server.js`**:
   - This file starts our backend server using **Node.js** and **Express.js** on port 5000.
   - It stores participants in a simple JavaScript array (`let registrations = [...]`).
   - It has two API endpoints:
     - `GET /api/registrations`: sends the list of participants to React.
     - `POST /api/registrations`: validates the submitted form data and saves the new runner into the array.

2. **`frontend/index.html`**:
   - The root HTML file that provides the title *"Run for Glory"*, loads the clean Poppins font, and holds `<div id="root"></div>` where React renders the website.

3. **`frontend/src/main.jsx`**:
   - The starting point of React that takes `App.jsx` and inserts it into the `root` div in `index.html`.

4. **`frontend/src/App.jsx`**:
   - The single main React component containing all 6 required sections:
     1. **Navbar** with Home, About, and Register.
     2. **Home section** with title "Run for Glory", tagline, running image, and Register Now button.
     3. **Event details section** with date, location, and 5K, 10K, 21K distances.
     4. **Registration form** with name, email, phone, and race category.
     5. **Success message** displayed after registration.
     6. **Participants table** displaying all registered participants live from the server.
   - It also contains the client-side JavaScript form validation and `fetch()` calls.

5. **`frontend/src/App.css`**:
   - Contains clean, modern styling using a **Light Theme**:
     - White background for Home, Form, and Navbar.
     - Soft light blue (`#eef6fc`) for Event Details and Participants Table.
     - Vibrant sporty orange (`#ff6b35`) for buttons and badges.
     - Responsive rules so the site works on mobile phones and laptops.

---

## 🎓 5. Technology Explanation for Your Review / Viva

When your examiner asks how each technology is used:

- **HTML (HyperText Markup Language):**  
  Used to structure the web page with semantic tags like `<nav>`, `<section>`, `<form>`, `<input>`, and `<table>`.

- **CSS (Cascading Style Sheets):**  
  Used to style the portal with a clean light theme, rounded corners, soft shadows, responsive grids, and orange buttons.

- **JavaScript:**  
  Used for client-side form validation (checking non-empty fields, valid email with `@` and `.`, and 10-digit phone numbers) and making asynchronous HTTP `fetch()` requests to the server.

- **React.js:**  
  Used as the frontend library. It manages the website's reactive state with `useState` (form inputs, error messages, and participant list) and loads data on startup with `useEffect`.

- **Node.js & Express.js:**  
  Used to build the backend REST API server. Node.js executes JavaScript on the server, while Express routes HTTP requests (`GET` and `POST`) and manages in-memory data without needing a database.

---

## 🎤 6. 3-Minute Presentation Script for Your Review

1. **Introduction (30 sec):**  
   *"Good morning, respected professors. Today I am presenting my Web Technology project: **Run for Glory**, a modern, responsive Marathon Registration Portal."*
2. **Frontend Architecture (1 min):**  
   *"For the frontend, I used React.js with Vite. The layout uses a clean, light theme with white and soft light blue sections. As you can see, there is a simple navbar, a home section with a marathon visual, event details for 5K, 10K, and 21K, and the registration form."*
3. **Validation & API Demonstration (1 min):**  
   *"Before submitting, JavaScript validates that the name is provided, the email is valid, and the phone number is exactly 10 digits. When I click Register, React sends a `fetch()` POST request to our Express backend. The backend validates and saves the runner into an in-memory array and responds with a success message. The participants table updates immediately."*
4. **Conclusion (30 sec):**  
   *"This project demonstrates clean full-stack communication between React and Express using RESTful APIs, modular design, and responsive CSS. Thank you!"*
