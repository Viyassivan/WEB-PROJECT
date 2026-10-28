// ==============================================================================
// [TECHNOLOGY 3 OF 5]: JAVASCRIPT (Client-Side Validation & Fetch API)
// [TECHNOLOGY 4 OF 5]: REACT.JS   (Components, Hooks: useState & useEffect)
// College Review Presentation File #3 & #4
// ==============================================================================
// Sections inside this file:
// 1. Navbar (Home, About, Register)
// 2. Home Section (Hero with faded background & running photo)
// 3. Event Details Section (Date, Location, 5K/10K/21K distances)
// 4. Registration Form (with JavaScript validation checks)
// 5. Success Message Alert
// 6. Registered Participants Table (Live fetch from backend)
// ==============================================================================

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
                  <tr key={p._id || p.id || index}>
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
