import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Autism Pathways Academy</h1>
        <p>A specialized learning platform for autistic adult learners</p>
      </header>
      <main>
        <section className="welcome-section">
          <h2>Welcome to Your Learning Journey</h2>
          <p>This platform is designed with accessibility and clear communication at its core.</p>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Accessible Learning</h3>
              <p>Customizable interface with sensory preferences and clear navigation</p>
            </div>
            <div className="feature-card">
              <h3>AI Tutor Support</h3>
              <p>Personalized assistance with adjustable communication styles</p>
            </div>
            <div className="feature-card">
              <h3>Structured Courses</h3>
              <p>Clear, predictable learning paths with explicit progress tracking</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 