# 🎓 College Review Presentation Guide (In Exact Order)

Use this guide during your Web Technology review tomorrow. Follow this exact order to show your files and speak confidently to your professor.

---

## 📋 The 5 Technologies in Presentation Order

| Order | Technology | File to Open in VS Code | What it Does in this Project |
| :---: | :--- | :--- | :--- |
| **1** | **HTML** | [`frontend/index.html`](file:///d:/akka/web-project/frontend/index.html) | Page structure, `<div id="root"></div>`, meta tags, and fonts |
| **2** | **CSS** | [`frontend/src/App.css`](file:///d:/akka/web-project/frontend/src/App.css) | Clean light theme, orange buttons, light blue cards, `::before` background |
| **3** | **JavaScript** | [`frontend/src/App.jsx`](file:///d:/akka/web-project/frontend/src/App.jsx#L36-L75) | Form validation (name, email, 10-digit phone) & `fetch()` calls |
| **4** | **React.js** | [`frontend/src/App.jsx`](file:///d:/akka/web-project/frontend/src/App.jsx#L18-L35) | Component structure, `useState` hooks, and `useEffect` lifecycle |
| **5** | **Node.js + Express** | [`backend/server.js`](file:///d:/akka/web-project/backend/server.js) | Server runtime, REST API (`GET`/`POST`), and in-memory array storage |

---

## 🗣️ Step-by-Step Presentation Script

---

### Step 1: HTML5
📂 **File to Open:** `frontend/index.html`

- **Lines to Point at:** 
  - Line 6: `<title>Run for Glory - Marathon Registration Portal</title>`
  - Line 8: Google Fonts link for modern typography (`Poppins`)
  - Line 11: `<div id="root"></div>`
- **What to Say:**
  > *"Respected Professor, HTML provides the foundational skeleton of our web application. In `index.html`, we have our semantic structure, viewport configuration for mobile responsiveness, and the `<div id="root"></div>` container where our React application mounts and renders."*

---

### Step 2: CSS3
📂 **File to Open:** `frontend/src/App.css`

- **Lines to Point at:**
  - Lines 14–25: `body` background (applying the full-page marathon runner background with light overlay for readability)
  - Lines 75–95: `.btn-orange` (styling the orange action buttons)
  - Lines 158–170: `.details-section` and `.table-section` (soft light-blue cards `#eef6fc` with subtle blur)
  - Lines 360–385: `@media (max-width: 768px)` (responsive design for mobile phones)
- **What to Say:**
  > *"For styling, we used pure CSS with a modern Light Theme. We set a marathon running background across the entire page using a CSS `linear-gradient` white overlay so all text and cards remain 100% readable. The event details and participant table feature soft light-blue cards, complemented by energetic orange buttons. We also used CSS Grid and Flexbox with media queries for full mobile responsiveness."*

---

### Step 3: JavaScript (ES6+)
📂 **File to Open:** `frontend/src/App.jsx`

- **Lines to Point at:**
  - Lines 36–52: Form Validation Logic inside `handleSubmit`
    - `formData.name.trim()` check
    - `formData.email.includes('@') && formData.email.includes('.')`
    - `formData.phone.length !== 10 || isNaN(formData.phone)`
  - Lines 54–75: `fetch()` POST request with `async/await` and JSON serialization
- **What to Say:**
  > *"JavaScript powers our client-side interactivity and validation. In `App.jsx`, before sending data to the server, JavaScript verifies that the name is provided, the email contains a valid domain structure with `@` and `.`, and the phone number contains exactly 10 digits. When valid, it uses the native `fetch()` API with `async/await` to send an asynchronous POST request to our Express backend."*

---

### Step 4: React.js
📂 **File to Open:** `frontend/src/App.jsx` and `frontend/src/main.jsx`

- **Lines to Point at:**
  - `frontend/src/main.jsx`: `ReactDOM.createRoot` mounting `<App />`
  - `frontend/src/App.jsx` Lines 18–26: `useState` hooks for `participants`, `formData`, `error`, and `successMessage`
  - `frontend/src/App.jsx` Lines 28–35: `useEffect` hook that automatically loads participants from the API when the component mounts
  - Lines 100–240: JSX layout combining Navbar, Hero, Event Details, Form, and Table
- **What to Say:**
  > *"For the frontend, we used React.js with Vite for high performance. React lets us build a Single Page Application using clean component architecture. We use the `useState` hook to manage reactive state (such as form inputs and participant records) and the `useEffect` hook to automatically fetch registered runners on page load. When a runner registers, React updates only the table without reloading the entire page."*

---

### Step 5: Node.js, Express.js & MongoDB
📂 **File to Open:** `backend/server.js`

- **Lines to Point at:**
  - Lines 9–14: `express()`, `cors()`, `express.json()`, and `mongoose` integration
  - Lines 18–20: `MONGO_URI` connected to MongoDB Atlas cluster (`cluster0.ygeo1xy.mongodb.net`)
  - Lines 23–31: Mongoose Schema & Model (`participantSchema` & `Participant`)
  - Lines 40–55: `mongoose.connect()` with automatic network fallback
  - Lines 58–68: `GET /api/registrations` retrieving records from MongoDB
  - Lines 70–98: `POST /api/registrations` saving new participants into MongoDB
  - Line 114: `app.listen(PORT)` running on port 5000
- **What to Say:**
  > *"On the backend, Node.js provides the JavaScript server runtime, and Express.js handles our REST API routes. We connected our backend to a cloud MongoDB Atlas database using Mongoose. We defined a Mongoose schema and model for participants. When a user submits the form, Express validates the data and saves it into MongoDB Atlas. We also included automatic network fallback so the server remains online and reliable during our review."*

---

## ❓ Rapid-Fire Viva Questions & Answers

1. **Q: Why is CORS needed?**  
   *A:* "Because our React frontend runs on port `5173` and Express runs on port `5000`. Browsers block cross-origin requests by default for security, so the `cors()` middleware explicitly permits communication between them."

2. **Q: What is the benefit of using React over plain HTML?**  
   *A:* "React uses a Virtual DOM and reactive state (`useState`). When a participant is added, only the table re-renders instead of reloading the entire web page."

3. **Q: Why use `async/await` with `fetch()`?**  
   *A:* "Network requests take time. `async/await` allows JavaScript to handle asynchronous API calls cleanly without blocking the browser UI thread or freezing the screen."

4. **Q: Where is data stored?**  
   *A:* "In an in-memory JavaScript array on the Node.js server. In a production release, this can be linked directly to a MongoDB or MySQL database."
